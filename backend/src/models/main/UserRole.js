const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');
const Role = require('./Role');
const SystemUser = require('./SystemUser');

const UserRole = mainDb.define('UserRole', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'system_users', key: 'id' },
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'roles', key: 'id' },
  },
}, {
  tableName: 'user_roles',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['user_id', 'role_id'] },
  ],
});

SystemUser.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'user_id',
  otherKey: 'role_id',
  as: 'rbac_roles',
});
Role.belongsToMany(SystemUser, {
  through: UserRole,
  foreignKey: 'role_id',
  otherKey: 'user_id',
  as: 'assigned_users',
});
UserRole.belongsTo(SystemUser, { foreignKey: 'user_id', as: 'user' });
UserRole.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

module.exports = UserRole;
