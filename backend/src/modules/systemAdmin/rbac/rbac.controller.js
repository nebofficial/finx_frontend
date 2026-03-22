const { Op } = require('sequelize');
const { mainDb } = require('../../../config/mainDb');
const Role = require('../../../models/main/Role');
const Permission = require('../../../models/main/Permission');
const RolePermission = require('../../../models/main/RolePermission');
const UserRole = require('../../../models/main/UserRole');
const SystemUser = require('../../../models/main/SystemUser');
const AuditLog = require('../../../models/main/AuditLog');
const { sendSuccess, sendCreated, sendBadRequest, sendError, sendNotFound } = require('../../../utils/response');

const DEFAULT_PERMISSION_KEYS = [
  'tenant.view', 'tenant.create', 'tenant.update', 'tenant.delete',
  'user.view', 'user.create', 'user.update', 'user.delete', 'user.manage',
  'role.view', 'role.create', 'role.update', 'role.delete', 'role.assign',
  'permission.view', 'permission.update',
  'loan.view', 'loan.create', 'loan.update', 'loan.delete', 'loan.approve', 'loan.disburse',
  'billing.view', 'billing.update',
  'audit.view',
];

const parsePermissionKey = (key) => {
  const [module = 'general', action = 'view'] = key.split('.');
  return {
    module,
    action,
    label: `${module[0]?.toUpperCase() || ''}${module.slice(1)} ${action[0]?.toUpperCase() || ''}${action.slice(1)}`,
  };
};

const writeAudit = async (req, action, resource, resourceId, oldValue = null, newValue = null) => {
  await AuditLog.create({
    actor_id: req.user?.id || null,
    actor_email: req.user?.email || null,
    actor_role: req.user?.role || null,
    tenant_id: null,
    action,
    resource,
    resource_id: resourceId || null,
    old_value: oldValue,
    new_value: newValue,
    ip_address: req.ip,
    user_agent: req.headers['user-agent'] || null,
    status: 'success',
  });
};

const seedDefaults = async () => {
  for (const key of DEFAULT_PERMISSION_KEYS) {
    const parts = parsePermissionKey(key);
    await Permission.findOrCreate({
      where: { key },
      defaults: { key, module: parts.module, action: parts.action, label: parts.label, is_active: true },
    });
  }

  const [systemAdminRole] = await Role.findOrCreate({
    where: { name: 'SystemAdmin', scope: 'system' },
    defaults: { description: 'Platform super role', is_default: true, is_active: true },
  });
  const [adminRole] = await Role.findOrCreate({
    where: { name: 'Admin', scope: 'tenant' },
    defaults: { description: 'Tenant administrator role', is_default: true, is_active: true },
  });
  const [supportRole] = await Role.findOrCreate({
    where: { name: 'Support', scope: 'system' },
    defaults: { description: 'Support operations role', is_default: true, is_active: true },
  });

  const permissions = await Permission.findAll({ attributes: ['id', 'key'] });
  for (const perm of permissions) {
    if (systemAdminRole) {
      await RolePermission.findOrCreate({ where: { role_id: systemAdminRole.id, permission_id: perm.id }, defaults: { allowed: true } });
    }
    if (adminRole && !perm.key.startsWith('tenant.delete')) {
      await RolePermission.findOrCreate({ where: { role_id: adminRole.id, permission_id: perm.id }, defaults: { allowed: true } });
    }
    if (supportRole && ['tenant.view', 'user.view', 'audit.view', 'billing.view'].includes(perm.key)) {
      await RolePermission.findOrCreate({ where: { role_id: supportRole.id, permission_id: perm.id }, defaults: { allowed: true } });
    }
  }
};

const getDashboard = async (req, res) => {
  try {
    await seedDefaults();
    const { search = '', scope, status } = req.query;
    const roleWhere = {};
    if (scope) roleWhere.scope = scope;
    if (status === 'active') roleWhere.is_active = true;
    if (status === 'inactive') roleWhere.is_active = false;
    if (search) roleWhere.name = { [Op.iLike]: `%${search}%` };

    const roles = await Role.findAll({
      where: roleWhere,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Permission, as: 'permissions', through: { attributes: [] }, attributes: ['id', 'key', 'module', 'action', 'label'] },
        { model: SystemUser, as: 'assigned_users', through: { attributes: [] }, attributes: ['id', 'name', 'email', 'role'] },
      ],
    });
    const permissions = await Permission.findAll({ where: { is_active: true }, order: [['module', 'ASC'], ['action', 'ASC']] });
    const users = await SystemUser.findAll({ where: { is_active: true }, attributes: ['id', 'name', 'email', 'role'], order: [['createdAt', 'DESC']] });
    const logs = await AuditLog.findAll({
      where: { action: { [Op.iLike]: 'RBAC_%' } },
      limit: 50,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'actor_email', 'actor_role', 'action', 'resource', 'resource_id', 'new_value', 'createdAt'],
    });

    return sendSuccess(res, { roles, permissions, users, logs });
  } catch (err) {
    return sendError(res, err.message || 'Failed to load role permission dashboard.');
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description, scope = 'system', permissionIds = [] } = req.body;
    if (!name) return sendBadRequest(res, 'Role name is required.');
    const exists = await Role.findOne({ where: { name, scope } });
    if (exists) return sendBadRequest(res, 'Role already exists in selected scope.');

    const created = await Role.create({ name, description, scope, is_active: true });
    if (permissionIds.length) {
      const rows = permissionIds.map((permission_id) => ({ role_id: created.id, permission_id, allowed: true }));
      await RolePermission.bulkCreate(rows, { ignoreDuplicates: true });
    }
    await writeAudit(req, 'RBAC_ROLE_CREATE', 'Role', created.id, null, { name, scope });
    return sendCreated(res, { role: created }, 'Role created successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to create role.');
  }
};

const updateRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return sendNotFound(res, 'Role not found.');
    const oldValue = role.toJSON();
    const { name, description, scope, is_active } = req.body;
    await role.update({
      name: name ?? role.name,
      description: description ?? role.description,
      scope: scope ?? role.scope,
      is_active: typeof is_active === 'boolean' ? is_active : role.is_active,
    });
    await writeAudit(req, 'RBAC_ROLE_UPDATE', 'Role', role.id, oldValue, role.toJSON());
    return sendSuccess(res, { role }, 'Role updated successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to update role.');
  }
};

const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return sendNotFound(res, 'Role not found.');
    const linkedUsers = await UserRole.count({ where: { role_id: role.id } });
    if (linkedUsers > 0) return sendBadRequest(res, 'Cannot delete role with assigned users.');
    const oldValue = role.toJSON();
    await RolePermission.destroy({ where: { role_id: role.id } });
    await role.destroy();
    await writeAudit(req, 'RBAC_ROLE_DELETE', 'Role', req.params.id, oldValue, null);
    return sendSuccess(res, null, 'Role deleted successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to delete role.');
  }
};

const cloneRole = async (req, res) => {
  const t = await mainDb.transaction();
  try {
    const { sourceRoleId, name, description } = req.body;
    const source = await Role.findByPk(sourceRoleId, { include: [{ model: Permission, as: 'permissions', through: { attributes: [] } }] });
    if (!source) {
      await t.rollback();
      return sendNotFound(res, 'Source role not found.');
    }
    const clone = await Role.create({
      name,
      description: description || `Cloned from ${source.name}`,
      scope: source.scope,
      is_active: true,
    }, { transaction: t });

    const permissionRows = source.permissions.map((perm) => ({
      role_id: clone.id,
      permission_id: perm.id,
      allowed: true,
    }));
    if (permissionRows.length > 0) {
      await RolePermission.bulkCreate(permissionRows, { transaction: t });
    }
    await t.commit();
    await writeAudit(req, 'RBAC_ROLE_CLONE', 'Role', clone.id, null, { sourceRoleId, clonedRoleId: clone.id });
    return sendCreated(res, { role: clone }, 'Role cloned successfully');
  } catch (err) {
    await t.rollback();
    return sendError(res, err.message || 'Failed to clone role.');
  }
};

const assignRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const user = await SystemUser.findByPk(userId);
    const role = await Role.findByPk(roleId);
    if (!user || !role) return sendBadRequest(res, 'Invalid user or role.');
    await UserRole.findOrCreate({ where: { user_id: userId, role_id: roleId } });
    await writeAudit(req, 'RBAC_ROLE_ASSIGN', 'UserRole', `${userId}:${roleId}`, null, { userId, roleId });
    return sendSuccess(res, null, 'Role assigned successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to assign role.');
  }
};

const bulkAssignRole = async (req, res) => {
  try {
    const { userIds = [], roleId } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) return sendBadRequest(res, 'At least one user is required.');
    const rows = userIds.map((userId) => ({ user_id: userId, role_id: roleId }));
    await UserRole.bulkCreate(rows, { ignoreDuplicates: true });
    await writeAudit(req, 'RBAC_ROLE_BULK_ASSIGN', 'UserRole', roleId, null, { userIds, roleId });
    return sendSuccess(res, null, 'Roles assigned successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to bulk assign roles.');
  }
};

const updatePermissions = async (req, res) => {
  const t = await mainDb.transaction();
  try {
    const { roleId, permissionIds = [] } = req.body;
    const role = await Role.findByPk(roleId);
    if (!role) {
      await t.rollback();
      return sendNotFound(res, 'Role not found.');
    }
    await RolePermission.destroy({ where: { role_id: roleId }, transaction: t });
    if (permissionIds.length) {
      const rows = permissionIds.map((permission_id) => ({ role_id: roleId, permission_id, allowed: true }));
      await RolePermission.bulkCreate(rows, { transaction: t });
    }
    await t.commit();
    await writeAudit(req, 'RBAC_PERMISSION_UPDATE', 'RolePermission', roleId, null, { permissionIds });
    return sendSuccess(res, null, 'Permissions updated successfully');
  } catch (err) {
    await t.rollback();
    return sendError(res, err.message || 'Failed to update permissions.');
  }
};

module.exports = {
  getDashboard,
  createRole,
  updateRole,
  deleteRole,
  cloneRole,
  assignRole,
  bulkAssignRole,
  updatePermissions,
};
