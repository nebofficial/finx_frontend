const Plan = require('../../../models/main/Plan');
const Subscription = require('../../../models/main/Subscription');
const Tenant = require('../../../models/main/Tenant');
const { sendSuccess, sendCreated, sendError, sendNotFound, sendBadRequest } = require('../../../utils/response');
const { getPagination, paginateMeta } = require('../../../utils/helpers');
const { Op } = require('sequelize');
const logger = require('../../../utils/logger');

// ────────── PLANS ──────────

const listPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll({ order: [['price_monthly', 'ASC']] });
    return sendSuccess(res, { plans });
  } catch (err) {
    return sendError(res, 'Failed to fetch plans.');
  }
};

const createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    return sendCreated(res, { plan }, 'Plan created successfully.');
  } catch (err) {
    return sendError(res, 'Failed to create plan. ' + err.message);
  }
};

const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) return sendNotFound(res, 'Plan not found.');
    await plan.update(req.body);
    return sendSuccess(res, { plan }, 'Plan updated.');
  } catch (err) {
    return sendError(res, 'Failed to update plan.');
  }
};

// ────────── SUBSCRIPTIONS ──────────

const listSubscriptions = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { tenant_id, status } = req.query;

    const where = {};
    if (tenant_id) where.tenant_id = tenant_id;
    if (status) where.status = status;

    const { count, rows } = await Subscription.findAndCountAll({
      where,
      include: [
        { model: Plan, as: 'plan' },
        { model: Tenant, as: 'tenant', attributes: ['id', 'name', 'slug', 'status'] },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return sendSuccess(res, { subscriptions: rows, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, 'Failed to fetch subscriptions.');
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

    // Expire existing subscriptions
    await Subscription.update(
      { status: 'cancelled' },
      { where: { tenant_id, status: ['active', 'trial'] } }
    );

    const subscription = await Subscription.create({
      tenant_id,
      plan_id,
      billing_cycle,
      status: 'active',
      payment_status: 'unpaid',
      amount: billing_cycle === 'yearly' ? plan.price_yearly : plan.price_monthly,
      start_date: now,
      end_date: endDate,
    });

    // Update tenant status
    await tenant.update({ status: 'active', trial_ends_at: null });

    return sendCreated(res, { subscription }, 'Plan assigned successfully.');
  } catch (err) {
    return sendError(res, 'Failed to assign plan. ' + err.message);
  }
};

// ────────── ANALYTICS ──────────

const platformAnalytics = async (req, res) => {
  try {
    const { mainDb } = require('../../../config/mainDb');
    const { QueryTypes } = require('sequelize');

    const [tenantStats] = await mainDb.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'active') AS active,
        COUNT(*) FILTER (WHERE status = 'trial') AS trial,
        COUNT(*) FILTER (WHERE status = 'suspended') AS suspended
      FROM tenants
      WHERE deleted_at IS NULL
    `, { type: QueryTypes.SELECT });

    const [revenueStats] = await mainDb.query(`
      SELECT
        COALESCE(SUM(amount), 0) AS total_revenue,
        COALESCE(SUM(amount) FILTER (WHERE payment_status = 'paid'), 0) AS collected_revenue,
        COUNT(*) FILTER (WHERE status = 'active') AS active_subscriptions
      FROM subscriptions
    `, { type: QueryTypes.SELECT });

    return sendSuccess(res, {
      tenants: tenantStats,
      revenue: revenueStats,
    });
  } catch (err) {
    return sendError(res, 'Failed to fetch analytics.');
  }
};

module.exports = { listPlans, createPlan, updatePlan, listSubscriptions, assignPlan, platformAnalytics };
