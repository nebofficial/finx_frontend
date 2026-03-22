const path = require('path');
const { Op } = require('sequelize');
const PlatformSupportTicket = require('../../../models/main/PlatformSupportTicket');
const PlatformSupportReply = require('../../../models/main/PlatformSupportReply');
const Tenant = require('../../../models/main/Tenant');
const SystemUser = require('../../../models/main/SystemUser');
const { sendSuccess, sendCreated, sendError, sendNotFound, sendBadRequest, sendForbidden } = require('../../../utils/response');
const { getPagination, paginateMeta } = require('../../../utils/helpers');
const { getTenantDb } = require('../../../config/tenantDb');
const { getTenantModels } = require('../../../models/tenant/index');
const {
  computeSla,
  assertValidStatusTransition,
  applyReplyAutoStatus,
  getTenantUserDisplay,
  getTenantUserEmail,
  notifyTicketCreated,
  notifyTicketAssigned,
  notifyNewReply,
  notifyStatusChanged,
  notifyResolved,
  notifyClosed,
  notifyEscalation,
} = require('../../../services/supportTicketService');

const buildReplyPayload = async (reply) => {
  const plain = reply.toJSON ? reply.toJSON() : reply;
  let authorName = 'Support';
  if (plain.author_kind === 'platform' && plain.author_platform_user_id) {
    const u = await SystemUser.findByPk(plain.author_platform_user_id);
    if (u) authorName = u.name;
  } else if (plain.author_kind === 'tenant' && plain.author_tenant_user_id) {
    const ticket = await PlatformSupportTicket.findByPk(plain.ticket_id);
    if (ticket) {
      authorName = await getTenantUserDisplay(ticket.tenant_id, plain.author_tenant_user_id);
    }
  }
  return { ...plain, author_name: authorName };
};

const listTickets = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { status, priority, tenant_id, q } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (tenant_id) where.tenant_id = tenant_id;
    if (q) {
      where[Op.or] = [
        { subject: { [Op.iLike]: `%${q}%` } },
        { ticket_no: { [Op.iLike]: `%${q}%` } },
      ];
    }

    const count = await PlatformSupportTicket.count({ where });
    const rows = await PlatformSupportTicket.findAll({
      where,
      include: [
        { model: Tenant, as: 'tenant', attributes: ['id', 'name', 'email', 'slug'], required: false },
        { model: SystemUser, as: 'assignee', attributes: ['id', 'name', 'email', 'role'], required: false },
      ],
      limit,
      offset,
      order: [['updatedAt', 'DESC']],
    });

    return sendSuccess(res, { tickets: rows, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, err.message || 'Failed to fetch tickets.');
  }
};

const ticketStats = async (req, res) => {
  try {
    const statuses = ['open', 'in_progress', 'waiting_for_user', 'resolved', 'closed', 'reopened'];
    const counts = {};
    for (const s of statuses) {
      counts[s] = await PlatformSupportTicket.count({ where: { status: s } });
    }
    const total = await PlatformSupportTicket.count();
    const now = new Date();
    const slaAtRisk = await PlatformSupportTicket.count({
      where: {
        status: { [Op.notIn]: ['resolved', 'closed'] },
        sla_resolution_due_at: { [Op.lt]: now },
      },
    });
    return sendSuccess(res, { counts, total, slaAtRisk });
  } catch (err) {
    return sendError(res, 'Failed to load stats.');
  }
};

const getTicket = async (req, res) => {
  try {
    const ticket = await PlatformSupportTicket.findByPk(req.params.id, {
      include: [
        { model: Tenant, as: 'tenant', attributes: ['id', 'name', 'email', 'slug'] },
        { model: SystemUser, as: 'assignee', attributes: ['id', 'name', 'email', 'role'] },
        { model: SystemUser, as: 'resolver', attributes: ['id', 'name', 'email'] },
      ],
    });
    if (!ticket) return sendNotFound(res, 'Ticket not found.');

    const replyRows = await PlatformSupportReply.findAll({
      where: { ticket_id: ticket.id },
      order: [['createdAt', 'ASC']],
    });

    const replies = [];
    for (const r of replyRows) {
      replies.push(await buildReplyPayload(r));
    }

    let requesterName = '—';
    try {
      requesterName = await getTenantUserDisplay(ticket.tenant_id, ticket.raised_by_tenant_user_id);
    } catch (e) { /* ignore */ }

    const data = ticket.toJSON();
    data.replies = replies;
    data.requester_name = requesterName;

    return sendSuccess(res, { ticket: data });
  } catch (err) {
    return sendError(res, err.message || 'Failed to load ticket.');
  }
};

const createTicket = async (req, res) => {
  try {
    const { tenant_id, subject, description, category, priority, team, initial_attachments, raised_by_tenant_user_id } = req.body;
    if (!tenant_id || !subject || !description) {
      return sendBadRequest(res, 'tenant_id, subject, and description are required.');
    }
    if (!raised_by_tenant_user_id) {
      return sendBadRequest(res, 'raised_by_tenant_user_id is required (requester in the tenant org).');
    }

    const tenant = await Tenant.findByPk(tenant_id);
    if (!tenant) return sendNotFound(res, 'Tenant not found.');

    const count = await PlatformSupportTicket.count();
    const ticket_no = `TCK-${String(count + 1).padStart(6, '0')}`;
    const sla = computeSla(priority || 'medium');

    const ticket = await PlatformSupportTicket.create({
      ticket_no,
      tenant_id,
      subject,
      description,
      category: category || 'technical',
      priority: priority || 'medium',
      status: 'open',
      raised_by_tenant_user_id,
      team: team || null,
      escalation_level: 1,
      ...sla,
      initial_attachments: initial_attachments || [],
    });

    await notifyTicketCreated(ticket, tenant);
    const full = await PlatformSupportTicket.findByPk(ticket.id, {
      include: [{ model: Tenant, as: 'tenant', attributes: ['id', 'name', 'email'] }],
    });
    return sendCreated(res, { ticket: full }, 'Ticket created.');
  } catch (err) {
    return sendError(res, err.message || 'Failed to create ticket.');
  }
};

/** Shared reply handler — platform user */
const addReplyInternal = async (req, res, opts = {}) => {
  const { isPlatform } = opts;
  try {
    const ticket = await PlatformSupportTicket.findByPk(req.params.id);
    if (!ticket) return sendNotFound(res, 'Ticket not found.');

    const message = req.body.message;
    const reply_type = req.body.type === 'internal' ? 'internal' : 'public';
    if (!message || !String(message).trim()) {
      return sendBadRequest(res, 'message is required.');
    }

    if (reply_type === 'internal' && !isPlatform) {
      return sendForbidden(res, 'Internal notes are only for support staff.');
    }

    const uploaded = (req.files || []).map((f) => ({
      name: f.originalname,
      url: `/uploads/support/${path.basename(f.path || f.filename)}`,
      mime: f.mimetype,
      size: f.size,
    }));

    let attachments = [];
    if (req.body.attachments) {
      try {
        attachments = typeof req.body.attachments === 'string' ? JSON.parse(req.body.attachments) : req.body.attachments;
      } catch (e) {
        attachments = [];
      }
    }
    attachments = [...attachments, ...uploaded];

    let mentions = [];
    if (req.body.mentions) {
      try {
        mentions = typeof req.body.mentions === 'string' ? JSON.parse(req.body.mentions) : req.body.mentions;
      } catch (e) { /* ignore */ }
    }

    const reply = await PlatformSupportReply.create({
      ticket_id: ticket.id,
      author_kind: isPlatform ? 'platform' : 'tenant',
      author_platform_user_id: isPlatform ? req.user.id : null,
      author_tenant_user_id: isPlatform ? null : req.user.id,
      message: message.trim(),
      reply_type,
      attachments,
      mentions,
    });

    const nextStatus = applyReplyAutoStatus(ticket, {
      authorIsPlatform: isPlatform,
      replyType: reply_type,
    });
    if (nextStatus !== ticket.status) {
      await ticket.update({ status: nextStatus });
    } else {
      await ticket.update({ updatedAt: new Date() });
    }

    const tenant = await Tenant.findByPk(ticket.tenant_id);
    const ownerEmail = await getTenantUserEmail(ticket.tenant_id, ticket.raised_by_tenant_user_id);
    const assignee = ticket.assigned_to_platform_user_id
      ? await SystemUser.findByPk(ticket.assigned_to_platform_user_id)
      : null;

    const recipients = new Set();
    if (tenant?.email) recipients.add(tenant.email);
    if (ownerEmail) recipients.add(ownerEmail);
    if (assignee?.email) recipients.add(assignee.email);

    await notifyNewReply(
      ticket,
      message.slice(0, 200),
      reply_type === 'internal',
      tenant,
      [...recipients]
    );

    const payload = await buildReplyPayload(reply);
    return sendCreated(res, { reply: payload, ticket: await ticket.reload() }, 'Reply added.');
  } catch (err) {
    return sendError(res, err.message || 'Failed to add reply.');
  }
};

const addReply = (req, res) => addReplyInternal(req, res, { isPlatform: true });

const patchStatus = async (req, res) => {
  try {
    const { status, resolution_notes } = req.body;
    if (!status) return sendBadRequest(res, 'status is required.');

    const ticket = await PlatformSupportTicket.findByPk(req.params.id);
    if (!ticket) return sendNotFound(res, 'Ticket not found.');

    const prev = ticket.status;
    assertValidStatusTransition(prev, status, { isPlatform: true, isTicketOwner: false });

    const updates = { status };
    if (status === 'resolved') {
      updates.resolved_at = new Date();
      updates.resolved_by_platform_user_id = req.user.id;
      updates.resolution_notes = resolution_notes || ticket.resolution_notes;
    }
    if (status === 'closed') {
      updates.closed_at = new Date();
      updates.closed_by_platform_user_id = req.user.id;
      updates.closed_by_tenant_user_id = null;
    }
    if (status === 'reopened') {
      updates.closed_at = null;
      updates.closed_by_platform_user_id = null;
      updates.closed_by_tenant_user_id = null;
      updates.resolved_at = null;
      updates.resolved_by_platform_user_id = null;
      updates.resolution_notes = null;
    }

    await ticket.update(updates);
    const tenant = await Tenant.findByPk(ticket.tenant_id);
    await notifyStatusChanged(ticket, prev, status, tenant);
    if (status === 'resolved') await notifyResolved(ticket, tenant);
    if (status === 'closed') await notifyClosed(ticket, tenant);

    return sendSuccess(res, { ticket }, 'Status updated.');
  } catch (err) {
    const code = err.statusCode || 500;
    return sendError(res, err.message || 'Failed to update status.', code);
  }
};

const patchAssign = async (req, res) => {
  try {
    const { assignedTo, team, escalation_level } = req.body;
    const ticket = await PlatformSupportTicket.findByPk(req.params.id);
    if (!ticket) return sendNotFound(res, 'Ticket not found.');

    const updates = {};
    if (assignedTo !== undefined) {
      if (assignedTo === null || assignedTo === '') {
        updates.assigned_to_platform_user_id = null;
      } else {
        const u = await SystemUser.findByPk(assignedTo);
        if (!u) return sendBadRequest(res, 'Assignee not found.');
        updates.assigned_to_platform_user_id = assignedTo;
      }
    }
    if (team !== undefined) updates.team = team;
    if (escalation_level !== undefined) {
      updates.escalation_level = Math.min(3, Math.max(1, parseInt(escalation_level, 10) || 1));
      const tenant = await Tenant.findByPk(ticket.tenant_id);
      await notifyEscalation(ticket, tenant, updates.escalation_level);
    }

    await ticket.update(updates);
    const reloaded = await PlatformSupportTicket.findByPk(ticket.id, {
      include: [
        { model: Tenant, as: 'tenant' },
        { model: SystemUser, as: 'assignee', attributes: ['id', 'name', 'email', 'role'] },
      ],
    });

    if (assignedTo) {
      const assignee = await SystemUser.findByPk(assignedTo);
      await notifyTicketAssigned(reloaded, assignee, reloaded.tenant);
    }

    return sendSuccess(res, { ticket: reloaded }, 'Assignment updated.');
  } catch (err) {
    return sendError(res, err.message || 'Failed to assign ticket.');
  }
};

const patchReply = async (req, res) => {
  try {
    const reply = await PlatformSupportReply.findOne({
      where: { id: req.params.replyId, ticket_id: req.params.id },
    });
    if (!reply) return sendNotFound(res, 'Reply not found.');
    const { message } = req.body;
    if (!message || !String(message).trim()) return sendBadRequest(res, 'message is required.');
    await reply.update({ message: message.trim(), edited_at: new Date() });
    const payload = await buildReplyPayload(reply);
    return sendSuccess(res, { reply: payload }, 'Reply updated.');
  } catch (err) {
    return sendError(res, 'Failed to update reply.');
  }
};

const deleteReply = async (req, res) => {
  try {
    const reply = await PlatformSupportReply.findOne({
      where: { id: req.params.replyId, ticket_id: req.params.id },
    });
    if (!reply) return sendNotFound(res, 'Reply not found.');
    await reply.destroy();
    return sendSuccess(res, {}, 'Reply deleted.');
  } catch (err) {
    return sendError(res, 'Failed to delete reply.');
  }
};

const listAgents = async (req, res) => {
  try {
    const agents = await SystemUser.findAll({
      where: { is_active: true, role: { [Op.in]: ['SystemAdmin', 'Support'] } },
      attributes: ['id', 'name', 'email', 'role'],
      order: [['name', 'ASC']],
    });
    return sendSuccess(res, { agents });
  } catch (err) {
    return sendError(res, 'Failed to load agents.');
  }
};

const listTenantUsers = async (req, res) => {
  try {
    const tenantId = req.query.tenant_id;
    if (!tenantId) return sendBadRequest(res, 'tenant_id is required.');

    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) return sendNotFound(res, 'Tenant not found.');

    const sequelize = getTenantDb(tenant.db_name);
    const { User } = getTenantModels(sequelize, tenant.db_name);
    const users = await User.findAll({
      where: { is_active: true },
      attributes: ['id', 'name', 'email', 'role'],
      order: [['name', 'ASC']],
    });

    return sendSuccess(res, { users });
  } catch (err) {
    return sendError(res, 'Failed to load tenant users.');
  }
};

module.exports = {
  listTickets,
  ticketStats,
  getTicket,
  createTicket,
  addReply,
  patchStatus,
  patchAssign,
  patchReply,
  deleteReply,
  listAgents,
  listTenantUsers,
};
