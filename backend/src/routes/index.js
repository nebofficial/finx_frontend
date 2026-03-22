const express = require('express');
const router = express.Router();

// Auth (public routes)
router.use('/auth', require('../modules/auth/auth.routes'));

// SystemAdmin — Platform Level (no tenantResolver, platformOnly guard)
router.use('/system/tenants', require('../modules/systemAdmin/tenant/tenant.routes'));
router.use('/system/rbac', require('../modules/systemAdmin/rbac/rbac.routes'));
router.use('/system/billing', require('../modules/systemAdmin/billing/billing.routes'));
router.use('/system/support', require('../modules/systemAdmin/support/platformSupport.routes'));

// Audit Logs (System level)
router.use('/system/audit', (() => {
  const r = express.Router();
  const AuditLog = require('../models/main/AuditLog');
  const { authMiddleware, platformOnly } = require('../middleware/authMiddleware');
  const { requireRole } = require('../middleware/rbacMiddleware');
  const { getPagination, paginateMeta } = require('../utils/helpers');
  const { sendSuccess, sendError } = require('../utils/response');
  const { Op } = require('sequelize');

  r.use(authMiddleware, platformOnly, requireRole('SystemAdmin', 'Support'));
  r.get('/', async (req, res) => {
    try {
      const { page, limit, offset } = getPagination(req.query);
      const where = {};
      if (req.query.tenant_id) where.tenant_id = req.query.tenant_id;
      if (req.query.actor_role) where.actor_role = req.query.actor_role;
      if (req.query.action) where.action = { [Op.iLike]: `%${req.query.action}%` };
      const { count, rows } = await AuditLog.findAndCountAll({
        where, limit, offset, order: [['createdAt', 'DESC']],
      });
      return sendSuccess(res, { logs: rows, meta: paginateMeta(count, page, limit) });
    } catch (err) {
      return sendError(res, 'Failed to fetch audit logs.');
    }
  });
  return r;
})());

// Tenant-scoped Routes
router.use('/super-admin', require('../modules/superAdmin/superAdmin.routes'));
router.use('/branches', require('../modules/branch/branch.routes'));
router.use('/members', require('../modules/member/member.routes'));
router.use('/deposits', require('../modules/deposit/deposit.routes'));
router.use('/loans', require('../modules/loan/loan.routes'));
router.use('/collections', require('../modules/collection/collection.routes'));
router.use('/ledger', require('../modules/ledger/ledger.routes'));
router.use('/transactions', require('../modules/transaction/transaction.routes'));
router.use('/reports', require('../modules/reports/reports.routes'));
router.use('/notifications', require('../modules/notification/notification.routes'));
router.use('/support', require('../modules/support/support.routes'));

module.exports = router;
