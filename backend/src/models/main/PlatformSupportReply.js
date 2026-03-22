const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');

const PlatformSupportReply = mainDb.define('PlatformSupportReply', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ticket_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  /** Who wrote the reply: platform (SystemUser) or tenant user */
  author_kind: {
    type: DataTypes.ENUM('platform', 'tenant'),
    allowNull: false,
  },
  author_platform_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  author_tenant_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  reply_type: {
    type: DataTypes.ENUM('public', 'internal'),
    allowNull: false,
    defaultValue: 'public',
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  mentions: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  edited_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'platform_support_replies',
  timestamps: true,
});

module.exports = PlatformSupportReply;
