const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');

const Role = mainDb.define('Role', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  scope: {
    type: DataTypes.ENUM('system', 'tenant', 'branch'),
    allowNull: false,
    defaultValue: 'system',
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'roles',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['name', 'scope'] },
    { fields: ['scope'] },
    { fields: ['is_active'] },
  ],
});

module.exports = Role;
