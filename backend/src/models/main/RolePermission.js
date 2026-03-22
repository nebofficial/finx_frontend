const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');
const Role = require('./Role');
const Permission = require('./Permission');

const RolePermission = mainDb.define('RolePermission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'roles', key: 'id' },
  },
  permission_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'permissions', key: 'id' },
  },
  allowed: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'role_permissions',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['role_id', 'permission_id'] },
  ],
});

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'permissions',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'roles',
});
RolePermission.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
RolePermission.belongsTo(Permission, { foreignKey: 'permission_id', as: 'permission' });

module.exports = RolePermission;
