const Plan = require('../../../models/main/Plan');
const Subscription = require('../../../models/main/Subscription');
const { sendSuccess, sendCreated, sendError, sendNotFound } = require('../../../utils/response');

const listPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll({ order: [['price_monthly', 'ASC']] });
    const data = [];
    for (const p of plans) {
      const json = p.toJSON();
      const subscriptions_count = await Subscription.count({ where: { plan_id: p.id } });
      data.push({ ...json, subscriptions_count });
    }
    return sendSuccess(res, { plans: data });
  } catch (err) {
    return sendError(res, 'Failed to fetch plans. ' + err.message);
  }
};

const createPlan = async (req, res) => {
  try {
    const payload = {
      name: String(req.body.name || '').trim(),
      description: req.body.description || null,
      price_monthly: Number(req.body.price_monthly || 0),
      price_yearly: Number(req.body.price_yearly || 0),
      max_users: Number(req.body.max_users || 5),
      max_branches: Number(req.body.max_branches || 1),
      max_members: Number(req.body.max_members || 100),
      trial_days: Number(req.body.trial_days || 14),
      features: req.body.features || {},
      is_active: req.body.is_active !== false,
    };
    if (!payload.name) {
      return sendError(res, 'Plan name is required.', 400);
    }
    const plan = await Plan.create(payload);
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
    return sendError(res, 'Failed to update plan. ' + err.message);
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) return sendNotFound(res, 'Plan not found.');
    await plan.update({ is_active: false });
    return sendSuccess(res, null, 'Plan archived successfully.');
  } catch (err) {
    return sendError(res, 'Failed to archive plan. ' + err.message);
  }
};

module.exports = { listPlans, createPlan, updatePlan, deletePlan };
