const { DataTypes } = require('sequelize');

const defineSupportTicket = (sequelize) => {
  const SupportTicket = sequelize.define('SupportTicket', {
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
    subject: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('technical', 'billing', 'account', 'feature_request', 'other'),
      defaultValue: 'technical',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium',
    },
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed', 'on_hold'),
      defaultValue: 'open',
    },
    raised_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assigned_to: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'SystemUser ID or SuperAdmin ID who is handling it',
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resolution_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    branch_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    tableName: 'support_tickets',
    timestamps: true,
  });

  return SupportTicket;
};

module.exports = defineSupportTicket;
