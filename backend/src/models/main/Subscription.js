const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');

const Subscription = mainDb.define('Subscription', {
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
  plan_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'plans', key: 'id' },
  },
  billing_cycle: {
    type: DataTypes.ENUM('monthly', 'yearly', 'trial'),
    defaultValue: 'trial',
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'cancelled', 'trial', 'pending'),
    defaultValue: 'trial',
  },
  payment_status: {
    type: DataTypes.ENUM('paid', 'unpaid', 'partial', 'free'),
    defaultValue: 'free',
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  coupon_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  next_billing_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  auto_renew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  payment_gateway: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g., stripe, esewa, khalti',
  },
  payment_reference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'subscriptions',
  timestamps: true,
});

module.exports = Subscription;
