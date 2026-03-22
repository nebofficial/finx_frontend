const { Op } = require('sequelize');
const Plan = require('../../../models/main/Plan');
const Subscription = require('../../../models/main/Subscription');
const Tenant = require('../../../models/main/Tenant');
const Invoice = require('../../../models/main/Invoice');
const { sendSuccess, sendError } = require('../../../utils/response');
const logger = require('../../../utils/logger');

const platformAnalytics = async (req, res) => {
  try {
    const [totalTenants, activeSubscriptions, subscriptions, invoices, allPlans] = await Promise.all([
      Tenant.count(),
      Subscription.count({ where: { status: 'active' } }),
      Subscription.findAll({ raw: true }),
      Invoice.findAll({ raw: true }),
      Plan.findAll({ attributes: ['id', 'name', 'price_monthly', 'price_yearly'], raw: true }),
    ]);
    const planMap = Object.fromEntries(allPlans.map((p) => [p.id, p]));

    // MRR should represent active recurring subscription value, not only paid invoices.
    const mrr = subscriptions
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => {
        const plan = s.plan_id ? planMap[s.plan_id] : null;
        const baseAmount = Number(s.amount || 0);
        const fallbackAmount = s.billing_cycle === 'yearly'
          ? Number(plan?.price_yearly || 0)
          : Number(plan?.price_monthly || 0);
        const effectiveAmount = baseAmount > 0 ? baseAmount : fallbackAmount;
        return sum + (s.billing_cycle === 'yearly' ? effectiveAmount / 12 : effectiveAmount);
      }, 0);

    // Pending revenue combines unpaid recurring subscriptions + pending/overdue invoices.
    const pendingFromSubscriptions = subscriptions
      .filter((s) => ['active', 'pending', 'trial'].includes(s.status) && ['unpaid', 'partial'].includes(s.payment_status))
      .reduce((sum, s) => {
        const plan = s.plan_id ? planMap[s.plan_id] : null;
        const baseAmount = Number(s.amount || 0);
        const fallbackAmount = s.billing_cycle === 'yearly'
          ? Number(plan?.price_yearly || 0)
          : Number(plan?.price_monthly || 0);
        return sum + (baseAmount > 0 ? baseAmount : fallbackAmount);
      }, 0);
    const pendingFromInvoices = invoices
      .filter((i) => ['pending', 'overdue'].includes(i.status))
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);
    const pendingRevenue = pendingFromSubscriptions + pendingFromInvoices;

    const currentYear = new Date().getFullYear();
    const monthly = await Invoice.findAll({
      where: { issued_at: { [Op.gte]: new Date(`${currentYear}-01-01`) } },
      raw: true,
    });
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenue_trend = months.map((month, index) => {
      const total = monthly
        .filter((inv) => new Date(inv.issued_at).getMonth() === index && inv.status === 'paid')
        .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
      return { month, revenue: total };
    });

    const activeSubscriptionRows = await Subscription.findAll({ where: { status: 'active' }, attributes: ['plan_id'], raw: true });
    const planDistribution = allPlans.map((plan) => ({
      plan: plan.name,
      count: activeSubscriptionRows.filter((s) => s.plan_id === plan.id).length,
    }));

    return sendSuccess(res, {
      stats: { total_tenants: totalTenants, active_subscriptions: activeSubscriptions, mrr, pending_revenue: pendingRevenue },
      revenue_trend,
      plan_distribution: planDistribution,
    });
  } catch (err) {
    logger.error('platformAnalytics failed:', err?.stack || err?.message || err);
    return sendError(res, `Failed to fetch analytics: ${err?.message || err || 'unknown error'}`);
  }
};

module.exports = { platformAnalytics };
