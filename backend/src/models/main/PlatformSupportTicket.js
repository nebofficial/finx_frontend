const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');

const PlatformSupportTicket = mainDb.define('PlatformSupportTicket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ticket_no: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('technical', 'billing', 'operational', 'other'),
    defaultValue: 'technical',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM(
      'open',
      'in_progress',
      'waiting_for_user',
      'resolved',
      'closed',
      'reopened'
    ),
    defaultValue: 'open',
  },
  /** Tenant-side user who opened the ticket */
  raised_by_tenant_user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  assigned_to_platform_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  team: {
    type: DataTypes.ENUM('technical', 'billing', 'general', 'operations'),
    allowNull: true,
  },
  escalation_level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  sla_response_due_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sla_resolution_due_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  resolved_by_platform_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  resolution_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  closed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  /** Platform user who closed (system admin/support) */
  closed_by_platform_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  /** Tenant user who closed (ticket owner) */
  closed_by_tenant_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  initial_attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
}, {
  tableName: 'platform_support_tickets',
  timestamps: true,
});

const PlatformSupportReply = require('./PlatformSupportReply');
const Tenant = require('./Tenant');
const SystemUser = require('./SystemUser');

PlatformSupportTicket.hasMany(PlatformSupportReply, { foreignKey: 'ticket_id', as: 'replies' });
PlatformSupportReply.belongsTo(PlatformSupportTicket, { foreignKey: 'ticket_id', as: 'ticket' });

PlatformSupportTicket.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
PlatformSupportTicket.belongsTo(SystemUser, { foreignKey: 'assigned_to_platform_user_id', as: 'assignee' });
PlatformSupportTicket.belongsTo(SystemUser, { foreignKey: 'resolved_by_platform_user_id', as: 'resolver' });

module.exports = PlatformSupportTicket;
