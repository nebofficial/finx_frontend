const Tenant = require('../models/main/Tenant');
const { getTenantDb } = require('../config/tenantDb');
const { getTenantModels } = require('../models/tenant/index');
const { sendForbidden, sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Tenant Resolver Middleware.
 *
 * After authMiddleware, this middleware:
 * 1. Reads tenant_id from req.user
 * 2. Looks up the tenant in Main DB → gets db_name
 * 3. Checks tenant status (blocks suspended/deleted)
 * 4. Creates Sequelize connection to the tenant DB
 * 5. Registers all tenant models
 * 6. Attaches req.db (models) and req.tenant (tenant record)
 */
const tenantResolver = async (req, res, next) => {
  try {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return sendForbidden(res, 'No tenant context found in token.');
    }

    // 1 — Lookup tenant in Main DB
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
      return sendForbidden(res, 'Tenant not found.');
    }

    // 2 — Check tenant status
    if (tenant.status === 'deleted') {
      return sendForbidden(res, 'This cooperative account has been deleted.');
    }
    if (tenant.status === 'suspended') {
      return sendForbidden(res, `Access suspended. Reason: ${tenant.suspension_reason || 'Non-payment or policy violation.'}`);
    }
    if (tenant.status === 'inactive') {
      return sendForbidden(res, 'This cooperative account is inactive. Please contact support.');
    }

    // 3 — Check trial expiry
    if (tenant.status === 'trial' && tenant.trial_ends_at && new Date() > new Date(tenant.trial_ends_at)) {
      return sendForbidden(res, 'Trial period has expired. Please upgrade your subscription.');
    }

    // 4 — Get (or create) tenant DB connection
    const tenantSequelize = getTenantDb(tenant.db_name);

    // 5 — Get all models for this tenant DB
    const models = getTenantModels(tenantSequelize, tenant.db_name);

    // 6 — Attach to request
    req.tenant = tenant;
    req.db = models;

    next();
  } catch (err) {
    logger.error('Tenant resolver error:', err);
    return sendError(res, 'Failed to resolve tenant context.');
  }
};

module.exports = tenantResolver;
