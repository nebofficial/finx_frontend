const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');

const Tenant = mainDb.define('Tenant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  db_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended', 'trial', 'deleted'),
    defaultValue: 'trial',
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  logo_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trial_ends_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  suspended_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  suspension_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'tenants',
  timestamps: true,
  paranoid: true, // soft-delete via deletedAt
  indexes: [
    { unique: true, fields: ['slug'] },
    { unique: true, fields: ['db_name'] },
  ],
});

module.exports = Tenant;
