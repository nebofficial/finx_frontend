const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');

const Permission = mainDb.define('Permission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  module: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'permissions',
  timestamps: true,
  indexes: [
    { fields: ['module'] },
    { fields: ['action'] },
  ],
});

module.exports = Permission;
