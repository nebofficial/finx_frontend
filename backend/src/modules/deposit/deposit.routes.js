const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const ctrl = require('./deposit.controller');
const validate = require('../../middleware/validate');
const { authMiddleware } = require('../../middleware/authMiddleware');
const tenantResolver = require('../../middleware/tenantResolver');
const { requireRole, branchScopeGuard } = require('../../middleware/rbacMiddleware');
const auditLogger = require('../../middleware/auditLogger');

router.use(authMiddleware, tenantResolver);

router.get('/accounts', requireRole('SuperAdmin', 'Admin', 'BranchAdmin', 'FieldCollector'), branchScopeGuard, ctrl.listAccounts);

router.post('/accounts',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin'),
  [body('member_id').isUUID(), body('type').notEmpty()],
  validate,
  auditLogger('CREATE_DEPOSIT_ACCOUNT', 'DepositAccount'),
  ctrl.createAccount
);

router.post('/deposit',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin', 'FieldCollector'),
  branchScopeGuard,
  [body('account_id').isUUID(), body('amount').isFloat({ min: 0.01 })],
  validate,
  auditLogger('DEPOSIT', 'DepositTransaction'),
  ctrl.deposit
);

router.post('/withdraw',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin'),
  branchScopeGuard,
  [body('account_id').isUUID(), body('amount').isFloat({ min: 0.01 })],
  validate,
  auditLogger('WITHDRAW', 'DepositTransaction'),
  ctrl.withdraw
);

router.get('/accounts/:accountId/statement',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin', 'FieldCollector'),
  branchScopeGuard,
  ctrl.getStatement
);

module.exports = router;
