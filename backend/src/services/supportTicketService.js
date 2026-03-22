const { Op } = require('sequelize');
const Tenant = require('../models/main/Tenant');
const SystemUser = require('../models/main/SystemUser');
const { getTenantDb } = require('../config/tenantDb');
const { getTenantModels } = require('../models/tenant/index');
const { sendEmail } = require('./notificationService');
const logger = require('../utils/logger');

const STATUSES = [
  'open',
  'in_progress',
  'waiting_for_user',
  'resolved',
  'closed',
  'reopened',
];

/** SLA windows from ticket creation (hours) */
const SLA = {
  critical: { response: 0.5, resolution: 4 },
  high: { response: 1, resolution: 6 },
  medium: { response: 4, resolution: 48 },
  low: { response: 24, resolution: 120 },
};

const addHours = (date, hours) => new Date(date.getTime() + hours * 60 * 60 * 1000);

const computeSla = (priority, fromDate = new Date()) => {
  const p = SLA[priority] || SLA.medium;
  return {
    sla_response_due_at: addHours(fromDate, p.response),
    sla_resolution_due_at: addHours(fromDate, p.resolution),
  };
};

/**
 * @param {string} current
 * @param {string} next
 * @param {{ isPlatform: boolean, isTicketOwner: boolean }} ctx
 */
const assertValidStatusTransition = (current, next, ctx) => {
  if (current === next) return;
  if (!STATUSES.includes(next)) {
    const err = new Error('Invalid status.');
    err.statusCode = 400;
    throw err;
  }

  const { isPlatform, isTicketOwner } = ctx;

  // Resolved: only platform (support) can set
  if (next === 'resolved' && !isPlatform) {
    const err = new Error('Only support can mark a ticket as resolved.');
    err.statusCode = 403;
    throw err;
  }

  // Closed: ticket owner (tenant) or platform
  if (next === 'closed' && !isPlatform && !isTicketOwner) {
    const err = new Error('Only the ticket requester or support can close this ticket.');
    err.statusCode = 403;
    throw err;
  }

  // Reopened: from closed/resolved — owner or platform
  if (next === 'reopened') {
    if (!['closed', 'resolved'].includes(current)) {
      const err = new Error('Invalid transition to reopened.');
      err.statusCode = 400;
      throw err;
    }
    if (!isPlatform && !isTicketOwner) {
      const err = new Error('Only the requester or support can reopen this ticket.');
      err.statusCode = 403;
      throw err;
    }
  }

  // Generic graph (simplified)
  const allowed = {
    open: ['in_progress', 'waiting_for_user', 'resolved', 'closed'],
    in_progress: ['waiting_for_user', 'resolved', 'closed'],
    waiting_for_user: ['in_progress', 'resolved', 'closed'],
    resolved: ['closed', 'reopened'],
    closed: ['reopened'],
    reopened: ['in_progress', 'waiting_for_user', 'resolved', 'closed'],
  };

  const from = allowed[current];
  if (!from || !from.includes(next)) {
    const err = new Error(`Cannot change status from ${current} to ${next}.`);
    err.statusCode = 400;
    throw err;
  }
};

/**
 * Auto status rules after a reply
 */
const applyReplyAutoStatus = (ticket, { authorIsPlatform, replyType }) => {
  if (replyType === 'internal') return ticket.status;
  const s = ticket.status;

  if (authorIsPlatform) {
    if (['open', 'waiting_for_user', 'reopened'].includes(s)) return 'in_progress';
    return s;
  }

  // Tenant reply
  if (s === 'closed' || s === 'resolved') return 'reopened';
  if (s === 'waiting_for_user') return 'in_progress';
  if (s === 'in_progress') return 'reopened';
  return s;
};

async function getTenantUser(tenantId, userId) {
  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant) return null;
  const sequelize = getTenantDb(tenant.db_name);
  const { User } = getTenantModels(sequelize, tenant.db_name);
  return User.findByPk(userId);
}

async function getTenantUserEmail(tenantId, userId) {
  const u = await getTenantUser(tenantId, userId);
  return u?.email || null;
}

async function getTenantUserDisplay(tenantId, userId) {
  const u = await getTenantUser(tenantId, userId);
  if (!u) return 'User';
  return u.name || u.email || 'User';
}

const ticketUrlForTenant = (ticketNo) =>
  `${process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/support`;

const ticketUrlPlatform = (id) =>
  `${process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:3000'}/systemadmin/support/${id}`;

async function notifyTicketCreated(ticket, tenant) {
  const to = tenant?.email;
  if (!to || !process.env.SMTP_HOST) return;
  await sendEmail({
    to,
    subject: `[Ticket ${ticket.ticket_no}] Created`,
    html: `<p>A new support ticket <strong>${ticket.ticket_no}</strong> was created.</p>
      <p><strong>Subject:</strong> ${ticket.subject}</p>
      <p>Status: ${ticket.status}</p>`,
  });
}

async function notifyTicketAssigned(ticket, assignee, tenant) {
  const emails = [tenant?.email].filter(Boolean);
  if (assignee?.email) emails.push(assignee.email);
  const unique = [...new Set(emails)];
  for (const to of unique) {
    if (!process.env.SMTP_HOST) continue;
    await sendEmail({
      to,
      subject: `[Ticket ${ticket.ticket_no}] Assigned`,
      html: `<p>Ticket <strong>${ticket.ticket_no}</strong> has been assigned to ${assignee?.name || 'support'}.</p>
        <p>Subject: ${ticket.subject}</p>`,
    });
  }
}

async function notifyNewReply(ticket, preview, isInternal, tenant, recipientEmails) {
  if (isInternal) return;
  for (const to of recipientEmails) {
    if (!to || !process.env.SMTP_HOST) continue;
    await sendEmail({
      to,
      subject: `[Ticket ${ticket.ticket_no}] New reply`,
      html: `<p>Ticket <strong>${ticket.ticket_no}</strong> has a new reply.</p>
        <p>${preview}</p>
        <p><a href="${ticketUrlPlatform(ticket.id)}">Open ticket</a></p>`,
    });
  }
}

async function notifyStatusChanged(ticket, prev, next, tenant) {
  const to = tenant?.email;
  if (!to || !process.env.SMTP_HOST) return;
  await sendEmail({
    to,
    subject: `[Ticket ${ticket.ticket_no}] Status: ${next}`,
    html: `<p>Hello,</p><p>Your ticket <strong>${ticket.ticket_no}</strong> status changed from <em>${prev}</em> to <em>${next}</em>.</p>
      <p>Subject: ${ticket.subject}</p>`,
  });
}

async function notifyResolved(ticket, tenant) {
  const to = tenant?.email;
  if (!to || !process.env.SMTP_HOST) return;
  await sendEmail({
    to,
    subject: `[Ticket ${ticket.ticket_no}] Resolved`,
    html: `<p>Your ticket <strong>${ticket.ticket_no}</strong> has been marked resolved.</p>
      <p>${ticket.resolution_notes ? `Notes: ${ticket.resolution_notes}` : ''}</p>`,
  });
}

async function notifyClosed(ticket, tenant) {
  const to = tenant?.email;
  if (!to || !process.env.SMTP_HOST) return;
  await sendEmail({
    to,
    subject: `[Ticket ${ticket.ticket_no}] Closed`,
    html: `<p>Ticket <strong>${ticket.ticket_no}</strong> is now closed.</p>`,
  });
}

async function notifyEscalation(ticket, tenant, level) {
  const to = process.env.SUPPORT_ALERT_EMAIL || tenant?.email;
  if (!to || !process.env.SMTP_HOST) return;
  await sendEmail({
    to,
    subject: `[Ticket ${ticket.ticket_no}] Escalated to level ${level}`,
    html: `<p>Ticket ${ticket.ticket_no} escalated. Subject: ${ticket.subject}</p>`,
  });
}

/** Check SLA breach — optional hook for cron */
const isSlaBreached = (ticket) => {
  const now = new Date();
  if (ticket.status === 'closed' || ticket.status === 'resolved') return false;
  if (ticket.sla_response_due_at && now > new Date(ticket.sla_response_due_at)) {
    const hasStaffReply = true; // would query replies; simplified
    return !hasStaffReply;
  }
  return false;
};

module.exports = {
  STATUSES,
  computeSla,
  assertValidStatusTransition,
  applyReplyAutoStatus,
  getTenantUser,
  getTenantUserEmail,
  getTenantUserDisplay,
  notifyTicketCreated,
  notifyTicketAssigned,
  notifyNewReply,
  notifyStatusChanged,
  notifyResolved,
  notifyClosed,
  notifyEscalation,
  isSlaBreached,
  ticketUrlPlatform,
  ticketUrlForTenant,
};
