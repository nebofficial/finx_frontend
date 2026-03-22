const Subscription = require('../models/main/Subscription');
const Plan = require('../models/main/Plan');
const { sendForbidden } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Subscription Guard Middleware.
 * Blocks access if the tenant's subscription is expired or the requested feature
 * is not available in their current plan.
 *
 * Usage:
 *   router.get('/api/sms', authMiddleware, tenantResolver, subscriptionGuard('sms'), controller)
 *   router.get('/api/reports', authMiddleware, tenantResolver, subscriptionGuard(), controller)
 *
 * @param {string|null} featureKey - Optional plan feature flag key to check (e.g., 'sms', 'api_access')
 */
const subscriptionGuard = (featureKey = null) => async (req, res, next) => {
  try {
    // Platform users bypass subscription checks
    if (req.user.type === 'platform') return next();

    const tenantId = req.tenant.id;

    const subscription = await Subscription.findOne({
      where: { tenant_id: tenantId, status: ['active', 'trial'] },
      include: [{ model: Plan, as: 'plan' }],
      order: [['createdAt', 'DESC']],
    });

    if (!subscription) {
      return sendForbidden(res, 'No active subscription found. Please contact your administrator.');
    }

    // Check if subscription has expired
    if (new Date() > new Date(subscription.end_date)) {
      return sendForbidden(res, 'Your subscription has expired. Please renew to continue.');
    }

    // Check specific feature access
    if (featureKey && subscription.plan) {
      const features = subscription.plan.features || {};
      if (!features[featureKey]) {
        return sendForbidden(res, `Feature '${featureKey}' is not available in your current plan. Please upgrade.`);
      }
    }

    // Attach subscription info for downstream use
    req.subscription = subscription;
    req.plan = subscription.plan;

    next();
  } catch (err) {
    logger.error('Subscription guard error:', err);
    return sendForbidden(res, 'Failed to validate subscription.');
  }
};

module.exports = subscriptionGuard;
