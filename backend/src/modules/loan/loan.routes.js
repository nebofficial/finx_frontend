const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const ctrl = require('./loan.controller');
const validate = require('../../middleware/validate');
const { authMiddleware } = require('../../middleware/authMiddleware');
const tenantResolver = require('../../middleware/tenantResolver');
const { requireRole, branchScopeGuard } = require('../../middleware/rbacMiddleware');
const auditLogger = require('../../middleware/auditLogger');

router.use(authMiddleware, tenantResolver);

// Applications
router.get('/applications', requireRole('SuperAdmin', 'Admin', 'BranchAdmin', 'FieldCollector'), branchScopeGuard, ctrl.listApplications);
router.post('/applications',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin', 'FieldCollector'),
  branchScopeGuard,
  [
    body('member_id').isUUID(),
    body('loan_type').notEmpty(),
    body('amount_requested').isFloat({ min: 1 }),
    body('tenure_months').isInt({ min: 1 }),
    body('interest_rate').isFloat({ min: 0 }),
  ],
  validate,
  auditLogger('SUBMIT_LOAN_APPLICATION', 'LoanApplication'),
  ctrl.createApplication
);

router.patch('/applications/:id/review',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin'),
  [body('action').isIn(['review', 'approve', 'reject'])],
  validate,
  auditLogger('REVIEW_LOAN_APPLICATION', 'LoanApplication'),
  ctrl.reviewApplication
);

router.post('/applications/:id/disburse',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin'),
  param('id').isUUID(),
  validate,
  auditLogger('DISBURSE_LOAN', 'LoanAccount'),
  ctrl.disburse
);

// Loan accounts
router.get('/accounts', requireRole('SuperAdmin', 'Admin', 'BranchAdmin', 'FieldCollector'), branchScopeGuard, ctrl.listLoanAccounts);
router.get('/accounts/:loanId/emi', requireRole('SuperAdmin', 'Admin', 'BranchAdmin', 'FieldCollector'), branchScopeGuard, ctrl.getEmiSchedule);

module.exports = router;
