const express = require('express');
const router = express.Router();
const ctrl = require('./reports.controller');
const { authMiddleware } = require('../../middleware/authMiddleware');
const tenantResolver = require('../../middleware/tenantResolver');
const { requireRole } = require('../../middleware/rbacMiddleware');

router.use(authMiddleware, tenantResolver);

// Dashboard stats (Admin, BranchAdmin)
router.get('/dashboard',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin'),
  ctrl.getDashboardSummary
);

// Collection by Collector (Admin, BranchAdmin)
router.get('/collection-by-collector',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin'),
  ctrl.getCollectionByCollector
);

module.exports = router;
