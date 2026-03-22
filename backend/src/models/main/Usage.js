const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');

const Usage = mainDb.define('Usage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'tenants', key: 'id' },
  },
  period_month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  period_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  branch_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  member_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  storage_mb: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  api_calls: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'usages',
  timestamps: true,
  indexes: [
    { fields: ['tenant_id'] },
    { fields: ['period_year', 'period_month'] },
  ],
});

module.exports = Usage;
