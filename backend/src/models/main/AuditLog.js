const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');

const AuditLog = mainDb.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  actor_id: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'User ID (either system_user.id or tenant user id)',
  },
  actor_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  actor_role: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'NULL for platform-level actions',
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'e.g., CREATE_MEMBER, APPROVE_LOAN, LOGIN_SUCCESS',
  },
  resource: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., Member, LoanAccount, Tenant',
  },
  resource_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  old_value: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  new_value: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('success', 'failure'),
    defaultValue: 'success',
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false, // logs are immutable
});

module.exports = AuditLog;
