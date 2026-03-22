const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');

const ApiKey = mainDb.define('ApiKey', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'tenants', key: 'id' },
    comment: 'NULL = platform-level key',
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  key_prefix: {
    type: DataTypes.STRING(8),
    allowNull: false,
    comment: 'First 8 chars for display (e.g. "finx_abc")',
  },
  key_hash: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Bcrypt hash of the full API key',
  },
  scopes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'e.g., ["read:members", "write:loans"]',
  },
  rate_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    comment: 'Requests per hour',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  last_used_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'api_keys',
  timestamps: true,
});

module.exports = ApiKey;
