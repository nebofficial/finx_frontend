const Tenant = require('../../../models/main/Tenant');
const Plan = require('../../../models/main/Plan');
const Subscription = require('../../../models/main/Subscription');
const Invoice = require('../../../models/main/Invoice');
const SystemUser = require('../../../models/main/SystemUser');
const { provisionTenantDatabase, deprovisionTenantDatabase } = require('../../../services/tenantProvisioner');
const { sendWelcomeEmail } = require('../../../services/notificationService');
const { hashPassword, generateToken, getPagination, paginateMeta } = require('../../../utils/helpers');
const { sendSuccess, sendCreated, sendError, sendNotFound, sendBadRequest } = require('../../../utils/response');
const { Op } = require('sequelize');
const logger = require('../../../utils/logger');

const nextInvoiceNo = async () => {
  const count = await Invoice.count();
  return `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
};

/**
 * GET /api/system/tenants
 * List all tenants with pagination and filters.
 */
const listTenants = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { status, search } = req.query;

    const where = {};
    if (status) where.status = status;
    if (search) where.name = { [Op.iLike]: `%${search}%` };

    const { count, rows } = await Tenant.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      paranoid: true,
    });

    return sendSuccess(res, {
      tenants: rows,
      meta: paginateMeta(count, page, limit),
    });
  } catch (err) {
    logger.error(err);
    return sendError(res, 'Failed to fetch tenants.');
  }
};

/**
 * POST /api/system/tenants
 * Create a new cooperative tenant + auto-provision database + seed SuperAdmin.
 */
const createTenant = async (req, res) => {
  try {
    const {
      name, slug, email, phone, address,
      plan_id,
      super_admin_name, super_admin_email, super_admin_password,
      trial_days = 14,
    } = req.body;

    // Check slug uniqueness
    const existing = await Tenant.findOne({ where: { slug } });
    if (existing) return sendBadRequest(res, 'Slug is already taken. Choose a unique identifier.');

    // Validate plan
    const plan = await Plan.findByPk(plan_id);
    if (!plan) return sendBadRequest(res, 'Invalid plan ID.');

    // Create tenant record (db_name will be updated by provisioner)
    const tenant = await Tenant.create({
      name, slug, email, phone, address,
      status: plan.name === 'Trial' ? 'trial' : 'active',
      trial_ends_at: plan.name === 'Trial'
        ? new Date(Date.now() + trial_days * 24 * 60 * 60 * 1000)
        : null,
      db_name: `pending_${slug}`, // temporary placeholder
    });

    // Create subscription
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + (plan.name === 'Trial' ? trial_days : 30));

    const subscription = await Subscription.create({
      tenant_id: tenant.id,
      plan_id,
      billing_cycle: plan.name === 'Trial' ? 'trial' : 'monthly',
      status: plan.name === 'Trial' ? 'trial' : 'active',
      payment_status: plan.name === 'Trial' ? 'free' : 'unpaid',
      amount: plan.name === 'Trial' ? 0 : Number(plan.price_monthly || 0),
      start_date: now,
      end_date: endDate,
      next_billing_date: endDate,
    });

    // Auto-generate initial invoice for this tenant setup.
    // For trial plans this creates a zero-value invoice with paid status.
    const initialAmount = Number(subscription.amount || 0);
    await Invoice.create({
      invoice_no: await nextInvoiceNo(),
      tenant_id: tenant.id,
      subscription_id: subscription.id,
      amount: initialAmount,
      issued_at: now,
      due_date: endDate,
      status: initialAmount > 0 ? 'pending' : 'paid',
      notes: `Auto-generated during tenant provisioning for plan ${plan.name}.`,
    });

    // Provision the tenant database
    const { dbName } = await provisionTenantDatabase({
      tenantId: tenant.id,
      tenantName: name,
      superAdminName: super_admin_name,
      superAdminEmail: super_admin_email,
      superAdminPassword: super_admin_password,
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(super_admin_email, super_admin_name, super_admin_password, name)
      .catch(e => logger.error('Welcome email failed:', e.message));

    const updatedTenant = await Tenant.findByPk(tenant.id);

    return sendCreated(res, { tenant: updatedTenant }, 'Cooperative created and provisioned successfully.');
  } catch (err) {
    logger.error('Create tenant error:', err);
    return sendError(res, 'Failed to create cooperative. ' + err.message);
  }
};

/**
 * GET /api/system/tenants/:id
 */
const getTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id, {
      include: [
        { model: Subscription, as: 'subscriptions', include: [{ model: Plan, as: 'plan' }] },
      ],
    });
    if (!tenant) return sendNotFound(res, 'Tenant not found.');
    return sendSuccess(res, { tenant });
  } catch (err) {
    logger.error(err);
    return sendError(res, 'Failed to fetch tenant.');
  }
};

/**
 * PUT /api/system/tenants/:id
 */
const updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return sendNotFound(res, 'Tenant not found.');
    const { name, email, phone, address, logo_url } = req.body;
    await tenant.update({ name, email, phone, address, logo_url });
    return sendSuccess(res, { tenant }, 'Tenant updated successfully.');
  } catch (err) {
    return sendError(res, 'Failed to update tenant.');
  }
};

/**
 * PATCH /api/system/tenants/:id/status
 * Change tenant status: activate | deactivate | suspend | delete
 */
const updateTenantStatus = async (req, res) => {
  try {
    const { status, suspension_reason } = req.body;
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return sendNotFound(res, 'Tenant not found.');

    const allowedStatuses = ['active', 'inactive', 'suspended'];
    if (!allowedStatuses.includes(status)) {
      return sendBadRequest(res, 'Invalid status. Use: active, inactive, suspended.');
    }

    await tenant.update({
      status,
      suspension_reason: status === 'suspended' ? suspension_reason : null,
      suspended_at: status === 'suspended' ? new Date() : null,
    });

    return sendSuccess(res, { tenant }, `Tenant ${status} successfully.`);
  } catch (err) {
    return sendError(res, 'Failed to update tenant status.');
  }
};

/**
 * DELETE /api/system/tenants/:id
 * Soft-delete tenant record + optionally drop DB.
 */
const deleteTenant = async (req, res) => {
  try {
    const { drop_database = false } = req.body;
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return sendNotFound(res, 'Tenant not found.');

    const dbName = tenant.db_name;

    await tenant.update({ status: 'deleted' });
    await tenant.destroy(); // soft-delete (paranoid)

    if (drop_database && dbName && !dbName.startsWith('pending_')) {
      deprovisionTenantDatabase(dbName).catch(e => logger.error('DB drop failed:', e.message));
    }

    return sendSuccess(res, {}, 'Tenant deleted successfully.');
  } catch (err) {
    return sendError(res, 'Failed to delete tenant.');
  }
};

module.exports = { listTenants, createTenant, getTenant, updateTenant, updateTenantStatus, deleteTenant };
