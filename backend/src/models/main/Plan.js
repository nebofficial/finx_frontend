const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');

const Plan = mainDb.define('Plan', {
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
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price_monthly: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  price_yearly: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  max_users: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    comment: '-1 means unlimited',
  },
  max_branches: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '-1 means unlimited',
  },
  max_members: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    comment: '-1 means unlimited',
  },
  features: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Feature flags: { sms: true, api_access: false, reports: true }',
  },
  trial_days: {
    type: DataTypes.INTEGER,
    defaultValue: 14,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'plans',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['name'] },
  ],
});

module.exports = Plan;
