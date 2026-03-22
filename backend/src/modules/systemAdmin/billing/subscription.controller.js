const { Op } = require('sequelize');
const Subscription = require('../../../models/main/Subscription');
const Tenant = require('../../../models/main/Tenant');
const Plan = require('../../../models/main/Plan');
const { getPagination, paginateMeta } = require('../../../utils/helpers');
const { sendSuccess, sendCreated, sendError, sendNotFound } = require('../../../utils/response');

const listSubscriptions = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.tenant_id) where.tenant_id = req.query.tenant_id;
    const { count, rows } = await Subscription.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      raw: true,
    });

    const tenantIds = [...new Set(rows.map((r) => r.tenant_id).filter(Boolean))];
    const planIds = [...new Set(rows.map((r) => r.plan_id).filter(Boolean))];
    const [tenants, plans] = await Promise.all([
      tenantIds.length
        ? Tenant.findAll({ where: { id: { [Op.in]: tenantIds } }, attributes: ['id', 'name', 'slug', 'status'], raw: true })
        : Promise.resolve([]),
      planIds.length
        ? Plan.findAll({ where: { id: { [Op.in]: planIds } }, attributes: ['id', 'name', 'price_monthly', 'price_yearly'], raw: true })
        : Promise.resolve([]),
    ]);
    const tenantMap = Object.fromEntries(tenants.map((t) => [t.id, t]));
    const planMap = Object.fromEntries(plans.map((p) => [p.id, p]));
    const subscriptions = rows.map((r) => ({ ...r, tenant: tenantMap[r.tenant_id] || null, plan: planMap[r.plan_id] || null }));
    return sendSuccess(res, { subscriptions, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, 'Failed to fetch subscriptions. ' + err.message);
  }
};

const assignPlan = async (req, res) => {
  try {
    const { tenant_id, plan_id, billing_cycle = 'monthly' } = req.body;
    const tenant = await Tenant.findByPk(tenant_id);
    if (!tenant) return sendNotFound(res, 'Tenant not found.');
    const plan = await Plan.findByPk(plan_id);
    if (!plan) return sendNotFound(res, 'Plan not found.');

    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + (billing_cycle === 'yearly' ? 12 : 1));
    await Subscription.update({ status: 'cancelled' }, { where: { tenant_id, status: ['active', 'trial', 'pending'] } });
    const subscription = await Subscription.create({
      tenant_id,
      plan_id,
      billing_cycle,
      status: 'active',
      payment_status: 'unpaid',
      amount: billing_cycle === 'yearly' ? plan.price_yearly : plan.price_monthly,
      start_date: now,
      end_date: endDate,
      next_billing_date: endDate,
      auto_renew: true,
    });
    await tenant.update({ status: 'active', trial_ends_at: null });
    return sendCreated(res, { subscription }, 'Plan assigned successfully.');
  } catch (err) {
    return sendError(res, 'Failed to assign plan. ' + err.message);
  }
};

const updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByPk(req.params.id);
    if (!subscription) return sendNotFound(res, 'Subscription not found.');
    await subscription.update(req.body);
    return sendSuccess(res, { subscription }, 'Subscription updated.');
  } catch (err) {
    return sendError(res, 'Failed to update subscription. ' + err.message);
  }
};

module.exports = { listSubscriptions, assignPlan, updateSubscription };
