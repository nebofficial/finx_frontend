const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserSession = sequelize.define('UserSession', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'JWT ID (jti) or Refresh Token identifier',
    },
    device_info: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User-Agent string',
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'user_sessions',
    timestamps: true,
  });

  return UserSession;
};
