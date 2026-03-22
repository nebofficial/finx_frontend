const path = require('path');
const PlatformSupportTicket = require('../../models/main/PlatformSupportTicket');
const PlatformSupportReply = require('../../models/main/PlatformSupportReply');
const Tenant = require('../../models/main/Tenant');
const SystemUser = require('../../models/main/SystemUser');
const { sendSuccess, sendCreated, sendError, sendNotFound, sendBadRequest, sendForbidden } = require('../../utils/response');
const { getPagination, paginateMeta } = require('../../utils/helpers');
const {
  computeSla,
  assertValidStatusTransition,
  applyReplyAutoStatus,
  getTenantUserDisplay,
  getTenantUserEmail,
  notifyTicketCreated,
  notifyNewReply,
  notifyStatusChanged,
  notifyClosed,
} = require('../../services/supportTicketService');

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
    const { status, priority } = req.query;
    const where = { tenant_id: req.tenant.id };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const { count, rows } = await PlatformSupportTicket.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const enriched = [];
    for (const t of rows) {
      const plain = t.toJSON();
      plain.requester_name = await getTenantUserDisplay(req.tenant.id, t.raised_by_tenant_user_id);
      enriched.push(plain);
    }

    return sendSuccess(res, { tickets: enriched, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, 'Failed to fetch support tickets.');
  }
};

const createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority, initial_attachments } = req.body;

    const count = await PlatformSupportTicket.count();
    const ticket_no = `TCK-${String(count + 1).padStart(6, '0')}`;
    const sla = computeSla(priority || 'medium');

    const ticket = await PlatformSupportTicket.create({
      ticket_no,
      tenant_id: req.tenant.id,
      raised_by_tenant_user_id: req.user.id,
      subject,
      description,
      category: category || 'technical',
      priority: priority || 'medium',
      status: 'open',
      escalation_level: 1,
      ...sla,
      initial_attachments: Array.isArray(initial_attachments) ? initial_attachments : [],
    });

    const tenant = await Tenant.findByPk(req.tenant.id);
    await notifyTicketCreated(ticket, tenant);

    return sendCreated(res, { ticket }, 'Support ticket raised successfully.');
  } catch (err) {
    return sendError(res, 'Failed to create support ticket. ' + err.message);
  }
};

const getTicket = async (req, res) => {
  try {
    const ticket = await PlatformSupportTicket.findOne({
      where: { id: req.params.id, tenant_id: req.tenant.id },
    });
    if (!ticket) return sendNotFound(res, 'Ticket not found.');

    const replyRows = await PlatformSupportReply.findAll({
      where: { ticket_id: ticket.id, reply_type: 'public' },
      order: [['createdAt', 'ASC']],
    });

    const replies = [];
    for (const r of replyRows) {
      replies.push(await buildReplyPayload(r));
    }

    const data = ticket.toJSON();
    data.replies = replies;
    data.requester_name = await getTenantUserDisplay(req.tenant.id, ticket.raised_by_tenant_user_id);

    return sendSuccess(res, { ticket: data });
  } catch (err) {
    return sendError(res, 'Failed to load ticket.');
  }
};

const addReply = async (req, res) => {
  try {
    const ticket = await PlatformSupportTicket.findOne({
      where: { id: req.params.id, tenant_id: req.tenant.id },
    });
    if (!ticket) return sendNotFound(res, 'Ticket not found.');

    const message = req.body.message;
    if (!message || !String(message).trim()) {
      return sendBadRequest(res, 'message is required.');
    }

    const uploaded = (req.files || []).map((f) => ({
      name: f.originalname,
      url: `/uploads/support/${path.basename(f.path)}`,
      mime: f.mimetype,
      size: f.size,
    }));

    const reply = await PlatformSupportReply.create({
      ticket_id: ticket.id,
      author_kind: 'tenant',
      author_platform_user_id: null,
      author_tenant_user_id: req.user.id,
      message: message.trim(),
      reply_type: 'public',
      attachments: uploaded,
      mentions: [],
    });

    const nextStatus = applyReplyAutoStatus(ticket, {
      authorIsPlatform: false,
      replyType: 'public',
    });
    if (nextStatus !== ticket.status) {
      await ticket.update({ status: nextStatus });
    }

    const tenant = await Tenant.findByPk(ticket.tenant_id);
    const assignee = ticket.assigned_to_platform_user_id
      ? await SystemUser.findByPk(ticket.assigned_to_platform_user_id)
      : null;

    const recipients = new Set();
    if (assignee?.email) recipients.add(assignee.email);
    if (process.env.SUPPORT_ALERT_EMAIL) recipients.add(process.env.SUPPORT_ALERT_EMAIL);

    await notifyNewReply(ticket, message.slice(0, 200), false, tenant, [...recipients]);

    const payload = await buildReplyPayload(reply);
    return sendCreated(res, { reply: payload, ticket: await ticket.reload() }, 'Reply added.');
  } catch (err) {
    return sendError(res, err.message || 'Failed to add reply.');
  }
};

const patchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return sendBadRequest(res, 'status is required.');

    const ticket = await PlatformSupportTicket.findOne({
      where: { id: req.params.id, tenant_id: req.tenant.id },
    });
    if (!ticket) return sendNotFound(res, 'Ticket not found.');

    const isTicketOwner = ticket.raised_by_tenant_user_id === req.user.id;
    const isTenantAdmin = ['SuperAdmin', 'Admin'].includes(req.user.role);
    if (!isTicketOwner && !isTenantAdmin) {
      return sendForbidden(res, 'Only the requester or an administrator can change ticket status.');
    }

    const prev = ticket.status;

    assertValidStatusTransition(prev, status, { isPlatform: false, isTicketOwner: isTicketOwner || isTenantAdmin });

    const updates = { status };
    if (status === 'closed' && isTicketOwner) {
      updates.closed_at = new Date();
      updates.closed_by_tenant_user_id = req.user.id;
      updates.closed_by_platform_user_id = null;
    }
    if (status === 'reopened') {
      updates.closed_at = null;
      updates.closed_by_tenant_user_id = null;
      updates.closed_by_platform_user_id = null;
      updates.resolved_at = null;
      updates.resolved_by_platform_user_id = null;
      updates.resolution_notes = null;
    }

    await ticket.update(updates);
    const tenant = await Tenant.findByPk(ticket.tenant_id);
    await notifyStatusChanged(ticket, prev, status, tenant);
    if (status === 'closed') await notifyClosed(ticket, tenant);

    return sendSuccess(res, { ticket }, 'Status updated.');
  } catch (err) {
    const code = err.statusCode || 500;
    return sendError(res, err.message || 'Failed to update status.', code);
  }
};

/** Legacy resolve endpoint — redirect logic: only platform should resolve */
const resolveTicket = async (req, res) => {
  return sendForbidden(
    res,
    'Tickets can only be resolved by platform support. Please wait for support or update status to closed.'
  );
};

module.exports = {
  listTickets,
  createTicket,
  getTicket,
  addReply,
  patchStatus,
  resolveTicket,
};
