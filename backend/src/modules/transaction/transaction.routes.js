const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const ctrl = require('./transaction.controller');
const validate = require('../../middleware/validate');
const { authMiddleware } = require('../../middleware/authMiddleware');
const tenantResolver = require('../../middleware/tenantResolver');
const { requireRole, branchScopeGuard } = require('../../middleware/rbacMiddleware');
const auditLogger = require('../../middleware/auditLogger');

router.use(authMiddleware, tenantResolver);

// List transactions (Admin sees all, BranchAdmin sees own branch)
router.get('/', 
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin'),
  ctrl.listTransactions
);

// Create general transaction (Receipt/Payment for branch ops)
router.post('/',
  requireRole('Admin', 'BranchAdmin'),
  [
    body('type').isIn(['receipt', 'payment', 'contra']),
    body('amount').isFloat({ gt: 0 }),
    body('payment_method').isIn(['cash', 'bank_transfer', 'cheque', 'upi']),
    body('description').notEmpty(),
  ],
  validate,
  auditLogger('CREATE_TRANSACTION', 'Transaction'),
  ctrl.createTransaction
);

module.exports = router;
