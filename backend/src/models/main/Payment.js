const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');

const Payment = mainDb.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  invoice_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'invoices', key: 'id' },
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'tenants', key: 'id' },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending',
  },
  gateway: {
    type: DataTypes.STRING(60),
    allowNull: true,
  },
  reference: {
    type: DataTypes.STRING(120),
    allowNull: true,
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'payments',
  timestamps: true,
  indexes: [
    { fields: ['invoice_id'] },
    { fields: ['tenant_id'] },
    { fields: ['status'] },
  ],
});

module.exports = Payment;
