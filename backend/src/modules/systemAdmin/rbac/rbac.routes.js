const express = require('express');
const router = express.Router();
const ctrl = require('./rbac.controller');
const { authMiddleware, platformOnly } = require('../../../middleware/authMiddleware');
const { requireRole } = require('../../../middleware/rbacMiddleware');
const { permissionGuard } = require('../../../middleware/permissionGuard');

router.use(authMiddleware, platformOnly, requireRole('SystemAdmin', 'Support'));

router.get('/dashboard', permissionGuard('role.view', 'permission.view'), ctrl.getDashboard);
router.post('/roles', requireRole('SystemAdmin'), permissionGuard('role.create'), ctrl.createRole);
router.put('/roles/:id', requireRole('SystemAdmin'), permissionGuard('role.update'), ctrl.updateRole);
router.delete('/roles/:id', requireRole('SystemAdmin'), permissionGuard('role.delete'), ctrl.deleteRole);
router.post('/roles/clone', requireRole('SystemAdmin'), permissionGuard('role.create'), ctrl.cloneRole);

router.post('/assign', requireRole('SystemAdmin'), permissionGuard('role.assign'), ctrl.assignRole);
router.post('/assign/bulk', requireRole('SystemAdmin'), permissionGuard('role.assign'), ctrl.bulkAssignRole);
router.put('/permissions', requireRole('SystemAdmin'), permissionGuard('permission.update'), ctrl.updatePermissions);

module.exports = router;
