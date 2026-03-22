const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('./collection.controller');
const validate = require('../../middleware/validate');
const { authMiddleware } = require('../../middleware/authMiddleware');
const tenantResolver = require('../../middleware/tenantResolver');
const { requireRole } = require('../../middleware/rbacMiddleware');
const auditLogger = require('../../middleware/auditLogger');

router.use(authMiddleware, tenantResolver);

// Collect EMI (FieldCollector, BranchAdmin, Admin)
router.post('/emi',
  requireRole('FieldCollector', 'BranchAdmin', 'Admin', 'SuperAdmin'),
  [
    body('emi_id').isUUID(),
    body('paid_amount').isFloat({ min: 0.01 }),
  ],
  validate,
  auditLogger('COLLECT_EMI', 'EmiPayment'),
  ctrl.collectEmi
);

// FieldCollector's assigned collection list
router.get('/my-collections',
  requireRole('FieldCollector', 'BranchAdmin', 'Admin'),
  ctrl.getMyCollections
);

// Daily summary
router.get('/daily-summary',
  requireRole('FieldCollector', 'BranchAdmin', 'Admin', 'SuperAdmin'),
  ctrl.getDailySummary
);

// Assign collector to loans (Route & Assignment API)
router.post('/assign',
  requireRole('Admin', 'BranchAdmin'),
  [
    body('loan_ids').isArray().notEmpty(),
    body('collector_id').isUUID(),
  ],
  validate,
  auditLogger('ASSIGN_COLLECTOR', 'LoanAccount'),
  ctrl.assignCollector
);

module.exports = router;
