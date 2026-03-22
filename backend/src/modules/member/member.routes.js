const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const ctrl = require('./member.controller');
const validate = require('../../middleware/validate');
const { authMiddleware } = require('../../middleware/authMiddleware');
const tenantResolver = require('../../middleware/tenantResolver');
const { requireRole, branchScopeGuard } = require('../../middleware/rbacMiddleware');
const auditLogger = require('../../middleware/auditLogger');

const allTenantRoles = ['SuperAdmin', 'Admin', 'BranchAdmin', 'FieldCollector', 'Staff'];

router.use(authMiddleware, tenantResolver);

router.get('/', requireRole(...allTenantRoles), branchScopeGuard, ctrl.listMembers);

router.post('/',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin', 'FieldCollector'),
  branchScopeGuard,
  [
    body('name').notEmpty(),
    body('phone').notEmpty(),
    body('branch_id').optional().isUUID(),
  ],
  validate,
  auditLogger('CREATE_MEMBER', 'Member'),
  ctrl.createMember
);

router.get('/:id', requireRole(...allTenantRoles), branchScopeGuard, ctrl.getMember);

router.put('/:id',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin', 'FieldCollector'),
  branchScopeGuard,
  auditLogger('UPDATE_MEMBER', 'Member'),
  ctrl.updateMember
);

router.patch('/:id/status',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin'),
  [param('id').isUUID(), body('status').isIn(['active', 'inactive', 'suspended', 'pending'])],
  validate,
  auditLogger('UPDATE_MEMBER_STATUS', 'Member'),
  ctrl.updateMemberStatus
);

router.patch('/:id/kyc',
  requireRole('SuperAdmin', 'Admin', 'BranchAdmin'),
  auditLogger('UPDATE_KYC', 'Member'),
  ctrl.updateKycStatus
);

module.exports = router;
