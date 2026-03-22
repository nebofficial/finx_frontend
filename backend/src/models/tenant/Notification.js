const { DataTypes } = require('sequelize');

const defineNotification = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('announcement', 'maintenance', 'billing', 'loan_overdue', 'system', 'alert'),
      defaultValue: 'announcement',
    },
    channel: {
      type: DataTypes.ARRAY(DataTypes.ENUM('email', 'sms', 'in_app')),
      defaultValue: ['in_app'],
    },
    is_broadcast: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'true = sent to all users in the tenant',
    },
    target_user_ids: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
      comment: 'Specific user IDs if not broadcast',
    },
    target_branch_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    sent_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'scheduled', 'sent', 'failed'),
      defaultValue: 'sent',
    },
  }, {
    tableName: 'notifications',
    timestamps: true,
  });

  return Notification;
};

module.exports = defineNotification;
