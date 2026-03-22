const { Op } = require('sequelize');
const Invoice = require('../../../models/main/Invoice');
const Tenant = require('../../../models/main/Tenant');
const Subscription = require('../../../models/main/Subscription');
const Plan = require('../../../models/main/Plan');
const Payment = require('../../../models/main/Payment');
const { sendEmail, isSmtpConfigured } = require('../../../services/notificationService');
const { getPagination, paginateMeta } = require('../../../utils/helpers');
const { sendSuccess, sendCreated, sendError, sendNotFound, sendBadRequest } = require('../../../utils/response');
const logger = require('../../../utils/logger');

const nextInvoiceNo = async () => {
  const count = await Invoice.count();
  return `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
};

const ensureInvoicesForSubscriptions = async () => {
  const subscriptions = await Subscription.findAll({
    where: { status: ['active', 'trial', 'pending', 'cancelled'] },
    raw: true,
  });
  if (subscriptions.length === 0) return;

  const existingInvoices = await Invoice.findAll({
    attributes: ['subscription_id'],
    where: { subscription_id: { [Op.ne]: null } },
    raw: true,
  });
  const existingSubIds = new Set(existingInvoices.map((inv) => inv.subscription_id).filter(Boolean));

  const missing = subscriptions.filter((sub) => !existingSubIds.has(sub.id));
  if (missing.length === 0) return;

  const plans = await Plan.findAll({ attributes: ['id', 'name', 'price_monthly', 'price_yearly'], raw: true });
  const planMap = Object.fromEntries(plans.map((p) => [p.id, p]));

  for (const sub of missing) {
    const plan = sub.plan_id ? planMap[sub.plan_id] : null;
    const baseAmount = Number(sub.amount || 0);
    const fallbackAmount = sub.billing_cycle === 'yearly'
      ? Number(plan?.price_yearly || 0)
      : Number(plan?.price_monthly || 0);
    const effectiveAmount = baseAmount > 0 ? baseAmount : fallbackAmount;
    const issuedAt = sub.start_date ? new Date(sub.start_date) : new Date();
    const dueDate = sub.next_billing_date
      ? new Date(sub.next_billing_date)
      : (sub.end_date ? new Date(sub.end_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    await Invoice.create({
      invoice_no: await nextInvoiceNo(),
      tenant_id: sub.tenant_id,
      subscription_id: sub.id,
      amount: effectiveAmount,
      issued_at: issuedAt,
      due_date: dueDate,
      status: effectiveAmount > 0 ? 'pending' : 'paid',
      notes: 'Auto-generated from existing subscription sync.',
    });
  }
};

const listInvoices = async (req, res) => {
  try {
    await ensureInvoicesForSubscriptions();
    const { page, limit, offset } = getPagination(req.query);
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.search) where[Op.or] = [{ invoice_no: { [Op.iLike]: `%${req.query.search}%` } }];
    const { count, rows } = await Invoice.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit, offset, raw: true });

    const tenantIds = [...new Set(rows.map((r) => r.tenant_id).filter(Boolean))];
    const subIds = [...new Set(rows.map((r) => r.subscription_id).filter(Boolean))];
    const [tenants, subscriptions] = await Promise.all([
      tenantIds.length
        ? Tenant.findAll({ where: { id: tenantIds }, attributes: ['id', 'name', 'email'], raw: true })
        : Promise.resolve([]),
      subIds.length
        ? Subscription.findAll({ where: { id: subIds }, attributes: ['id', 'plan_id'], raw: true })
        : Promise.resolve([]),
    ]);
    const planIds = [...new Set(subscriptions.map((s) => s.plan_id).filter(Boolean))];
    const plans = planIds.length
      ? await Plan.findAll({ where: { id: planIds }, attributes: ['id', 'name'], raw: true })
      : [];
    const tenantMap = Object.fromEntries(tenants.map((t) => [t.id, t]));
    const subMap = Object.fromEntries(subscriptions.map((s) => [s.id, s]));
    const planMap = Object.fromEntries(plans.map((p) => [p.id, p]));

    const invoices = rows.map((row) => {
      const sub = row.subscription_id ? subMap[row.subscription_id] : null;
      return {
        ...row,
        tenant_name: tenantMap[row.tenant_id]?.name || '-',
        tenant_email: tenantMap[row.tenant_id]?.email || '',
        plan_name: sub?.plan_id ? planMap[sub.plan_id]?.name || '-' : '-',
      };
    });
    return sendSuccess(res, { invoices, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, 'Failed to fetch invoices. ' + err.message);
  }
};

const createInvoice = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.invoice_no) payload.invoice_no = await nextInvoiceNo();
    const invoice = await Invoice.create(payload);
    return sendCreated(res, { invoice }, 'Invoice created successfully.');
  } catch (err) {
    return sendError(res, 'Failed to create invoice. ' + err.message);
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return sendNotFound(res, 'Invoice not found.');
    const { status } = req.body;
    await invoice.update({ status });
    return sendSuccess(res, { invoice }, 'Invoice status updated.');
  } catch (err) {
    return sendError(res, 'Failed to update invoice status. ' + err.message);
  }
};

const sendInvoice = async (req, res) => {
  try {
    if (!isSmtpConfigured()) {
      return sendError(
        res,
        'Email is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM in backend/.env. If the password contains special characters, wrap SMTP_PASS in double quotes.',
        503
      );
    }

    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return sendNotFound(res, 'Invoice not found.');

    const tenant = await Tenant.findByPk(invoice.tenant_id, { attributes: ['id', 'name', 'email'] });
    const recipient = String(tenant?.email || '').trim();
    if (!tenant || !recipient) {
      return sendBadRequest(res, 'Tenant email is missing for this invoice.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      return sendBadRequest(res, 'Tenant email address is invalid. Update the tenant record with a valid email.');
    }

    let planName = '-';
    if (invoice.subscription_id) {
      const sub = await Subscription.findByPk(invoice.subscription_id, { attributes: ['plan_id'] });
      if (sub?.plan_id) {
        const plan = await Plan.findByPk(sub.plan_id, { attributes: ['name'] });
        if (plan?.name) planName = plan.name;
      }
    }

    const issuedDate = invoice.issued_at ? new Date(invoice.issued_at).toLocaleDateString() : '-';
    const dueDate = invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-';
    const amount = Number(invoice.amount || 0).toFixed(2);

    const result = await sendEmail({
      to: recipient,
      subject: `Invoice ${invoice.invoice_no} from FinX`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px;">
          <h2>Invoice ${invoice.invoice_no}</h2>
          <p>Hello ${tenant.name || 'Customer'},</p>
          <p>Please find your invoice details below:</p>
          <table border="1" cellpadding="8" style="border-collapse: collapse;">
            <tr><td><strong>Invoice ID</strong></td><td>${invoice.invoice_no}</td></tr>
            <tr><td><strong>Tenant</strong></td><td>${tenant.name || '-'}</td></tr>
            <tr><td><strong>Plan</strong></td><td>${planName}</td></tr>
            <tr><td><strong>Amount</strong></td><td>$${amount}</td></tr>
            <tr><td><strong>Issued Date</strong></td><td>${issuedDate}</td></tr>
            <tr><td><strong>Due Date</strong></td><td>${dueDate}</td></tr>
            <tr><td><strong>Status</strong></td><td>${invoice.status}</td></tr>
          </table>
          <p style="margin-top: 16px;">Thanks,<br/>FinX Billing Team</p>
        </div>
      `,
      text: `Invoice ${invoice.invoice_no}\nTenant: ${tenant.name || '-'}\nPlan: ${planName}\nAmount: $${amount}\nIssued: ${issuedDate}\nDue: ${dueDate}\nStatus: ${invoice.status}`,
    });

    if (!result.success) {
      return sendError(res, `Failed to send invoice email. ${result.error || ''}`.trim(), 502);
    }

    await invoice.update({ status: invoice.status === 'draft' ? 'pending' : invoice.status });
    return sendSuccess(res, { invoice, messageId: result.messageId }, 'Invoice emailed successfully.');
  } catch (err) {
    logger.error('sendInvoice failed:', err?.stack || err?.message || err);
    const detail = err?.message || (err && String(err)) || 'Unknown error';
    return sendError(res, `Failed to send invoice: ${detail}`, 500);
  }
};

const invoiceSummary = async (req, res) => {
  try {
    await ensureInvoicesForSubscriptions();
    const invoices = await Invoice.findAll({ raw: true });
    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    return sendSuccess(res, {
      totalInvoices: invoices.length,
      paid: invoices.filter((i) => i.status === 'paid').length,
      pending: invoices.filter((i) => i.status === 'pending').length,
      overdue: invoices.filter((i) => i.status === 'overdue').length,
      totalRevenue,
    });
  } catch (err) {
    return sendError(res, 'Failed to fetch invoice summary. ' + err.message);
  }
};

const recordPayment = async (req, res) => {
  try {
    const { invoice_id, tenant_id, amount, gateway, reference } = req.body;
    const payment = await Payment.create({
      invoice_id,
      tenant_id,
      amount,
      gateway,
      reference,
      status: 'success',
      paid_at: new Date(),
    });
    const invoice = await Invoice.findByPk(invoice_id);
    if (invoice) await invoice.update({ status: 'paid' });
    return sendCreated(res, { payment }, 'Payment recorded successfully.');
  } catch (err) {
    return sendError(res, 'Failed to record payment.');
  }
};

module.exports = { listInvoices, createInvoice, updateInvoiceStatus, sendInvoice, invoiceSummary, recordPayment };
