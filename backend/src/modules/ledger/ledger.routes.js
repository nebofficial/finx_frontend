const express = require('express');
const router = express.Router();
const ctrl = require('./ledger.controller');
const { body } = require('express-validator');
const validate = require('../../middleware/validate');
const { authMiddleware } = require('../../middleware/authMiddleware');
const tenantResolver = require('../../middleware/tenantResolver');
const { requireRole, branchScopeGuard } = require('../../middleware/rbacMiddleware');

router.use(authMiddleware, tenantResolver);

router.get('/entries', requireRole('SuperAdmin', 'Admin', 'BranchAdmin'), branchScopeGuard, ctrl.listLedgerEntries);
router.get('/trial-balance', requireRole('SuperAdmin', 'Admin', 'BranchAdmin'), branchScopeGuard, ctrl.getTrialBalance);

router.post('/journal',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin'),
  [
    body('entries').isArray({ min: 2 }),
    body('entries.*.account_code').notEmpty(),
    body('entries.*.debit').isFloat({ min: 0 }),
    body('entries.*.credit').isFloat({ min: 0 }),
  ],
  validate,
  ctrl.postJournalEntry
);

module.exports = router;
