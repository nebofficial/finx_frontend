const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');

const Invoice = mainDb.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  invoice_no: {
    type: DataTypes.STRING(40),
    allowNull: false,
    unique: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'tenants', key: 'id' },
  },
  subscription_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'subscriptions', key: 'id' },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  issued_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'paid', 'overdue', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'invoices',
  timestamps: true,
  indexes: [
    { fields: ['tenant_id'] },
    { fields: ['status'] },
    { unique: true, fields: ['invoice_no'] },
  ],
});

module.exports = Invoice;
