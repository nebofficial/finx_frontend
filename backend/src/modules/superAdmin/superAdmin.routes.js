const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const ctrl = require('./superAdmin.controller');
const validate = require('../../middleware/validate');
const { authMiddleware } = require('../../middleware/authMiddleware');
const tenantResolver = require('../../middleware/tenantResolver');
const { requireRole } = require('../../middleware/rbacMiddleware');
const auditLogger = require('../../middleware/auditLogger');

router.use(authMiddleware, tenantResolver);

// All routes here require SuperAdmin role
router.use(requireRole('SuperAdmin'));

// Organization
router.get('/organization', ctrl.getOrganizationSettings);
router.put('/organization',
  [body('name').notEmpty(), body('email').isEmail()],
  validate,
  auditLogger('UPDATE_ORGANIZATION_SETTINGS', 'Tenant'),
  ctrl.updateOrganizationSettings
);

// Users
router.get('/users', ctrl.listUsers);
router.post('/users',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('role').isIn(['Admin', 'BranchAdmin', 'FieldCollector', 'Staff']),
    body('password').isLength({ min: 8 })
  ],
  validate,
  auditLogger('CREATE_USER_SUPERADMIN', 'User'),
  ctrl.createUser
);
router.patch('/users/:id/status',
  [param('id').isUUID(), body('is_active').isBoolean()],
  validate,
  auditLogger('UPDATE_USER_STATUS', 'User'),
  ctrl.updateUserStatus
);

// Subscription
router.get('/subscription', ctrl.getMySubscription);

module.exports = router;
