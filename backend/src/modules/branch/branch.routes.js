const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const ctrl = require('./branch.controller');
const validate = require('../../middleware/validate');
const { authMiddleware } = require('../../middleware/authMiddleware');
const tenantResolver = require('../../middleware/tenantResolver');
const { requireRole, branchScopeGuard } = require('../../middleware/rbacMiddleware');
const auditLogger = require('../../middleware/auditLogger');

router.use(authMiddleware, tenantResolver);

router.get('/', requireRole('SuperAdmin', 'Admin', 'BranchAdmin'), branchScopeGuard, ctrl.listBranches);

router.post('/',
  requireRole('SuperAdmin', 'Admin'),
  [body('name').notEmpty()],
  validate,
  auditLogger('CREATE_BRANCH', 'Branch'),
  ctrl.createBranch
);

router.put('/:id', requireRole('SuperAdmin', 'Admin', 'BranchAdmin'), branchScopeGuard, auditLogger('UPDATE_BRANCH', 'Branch'), ctrl.updateBranch);
router.patch('/:id/toggle', requireRole('SuperAdmin', 'Admin'), auditLogger('TOGGLE_BRANCH', 'Branch'), ctrl.toggleBranch);
router.patch('/:id/assign-manager', requireRole('SuperAdmin', 'Admin'), auditLogger('ASSIGN_BRANCH_MANAGER', 'Branch'), ctrl.assignManager);

// Branch users
router.get('/:branchId/users', requireRole('SuperAdmin', 'Admin', 'BranchAdmin'), branchScopeGuard, ctrl.listBranchUsers);
router.post('/:branchId/users',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin'),
  branchScopeGuard,
  [body('name').notEmpty(), body('email').isEmail(), body('role').notEmpty(), body('password').isLength({ min: 8 })],
  validate,
  auditLogger('CREATE_BRANCH_USER', 'User'),
  ctrl.createBranchUser
);

module.exports = router;
