const Role = require('../models/main/Role');
const Permission = require('../models/main/Permission');
const UserRole = require('../models/main/UserRole');
const { sendForbidden } = require('../utils/response');

const permissionGuard = (...permissionKeys) => {
  return async (req, res, next) => {
    try {
      if (!req.user) return sendForbidden(res, 'Unauthorized access.');
      if (req.user.role === 'SystemAdmin') return next();
      if (req.user.type !== 'platform') {
        return sendForbidden(res, 'Permission guard currently supports platform users only.');
      }

      const roleLinks = await UserRole.findAll({ where: { user_id: req.user.id }, attributes: ['role_id'] });
      if (!roleLinks.length) return sendForbidden(res, 'No role assigned.');
      const roleIds = roleLinks.map((row) => row.role_id);

      const roles = await Role.findAll({
        where: { id: roleIds, is_active: true },
        include: [{ model: Permission, as: 'permissions', through: { attributes: [] }, attributes: ['key'] }],
      });
      const granted = new Set();
      roles.forEach((role) => role.permissions.forEach((perm) => granted.add(perm.key)));
      const denied = permissionKeys.filter((key) => !granted.has(key));
      if (denied.length > 0) {
        return sendForbidden(res, `Access denied. Missing permissions: ${denied.join(', ')}`);
      }
      req.user.permissions = Array.from(granted);
      return next();
    } catch (err) {
      return sendForbidden(res, 'Permission validation failed.');
    }
  };
};

module.exports = { permissionGuard };
