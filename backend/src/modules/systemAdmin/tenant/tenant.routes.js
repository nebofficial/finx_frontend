const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const ctrl = require('./tenant.controller');
const validate = require('../../../middleware/validate');
const { authMiddleware, platformOnly } = require('../../../middleware/authMiddleware');
const { requireRole } = require('../../../middleware/rbacMiddleware');
const auditLogger = require('../../../middleware/auditLogger');

// All routes require platform-level authentication
router.use(authMiddleware, platformOnly, requireRole('SystemAdmin', 'Support'));

router.get('/', ctrl.listTenants);

router.post('/',
  requireRole('SystemAdmin'),
  [
    body('name').notEmpty(),
    body('slug')
      .notEmpty()
      .customSanitizer((v) =>
        String(v)
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, ''),
      )
      .matches(/^[a-z0-9-]+$/)
      .withMessage('Slug must be lowercase alphanumeric with hyphens'),
    body('email').isEmail(),
    body('plan_id').isUUID(),
    body('super_admin_name').notEmpty(),
    body('super_admin_email').isEmail(),
    body('super_admin_password').isLength({ min: 8 }),
  ],
  validate,
  auditLogger('CREATE_TENANT', 'Tenant'),
  ctrl.createTenant
);

router.get('/:id', param('id').isUUID(), validate, ctrl.getTenant);

router.put('/:id',
  requireRole('SystemAdmin'),
  param('id').isUUID(),
  validate,
  auditLogger('UPDATE_TENANT', 'Tenant'),
  ctrl.updateTenant
);

router.patch('/:id/status',
  requireRole('SystemAdmin'),
  [param('id').isUUID(), body('status').notEmpty()],
  validate,
  auditLogger('UPDATE_TENANT_STATUS', 'Tenant'),
  ctrl.updateTenantStatus
);

router.delete('/:id',
  requireRole('SystemAdmin'),
  param('id').isUUID(),
  validate,
  auditLogger('DELETE_TENANT', 'Tenant'),
  ctrl.deleteTenant
);

module.exports = router;
