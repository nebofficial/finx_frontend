const { DataTypes } = require('sequelize');
const { mainDb } = require('../../config/mainDb');

const SystemUser = mainDb.define('SystemUser', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('SystemAdmin', 'Support'),
    allowNull: false,
    defaultValue: 'Support',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  last_login_ip: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otp_secret: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  must_change_password: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'system_users',
  timestamps: true,
  paranoid: true,
  indexes: [
    { unique: true, fields: ['email'] },
  ],
});

// Never expose the hash in JSON output
SystemUser.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password_hash;
  delete values.otp_secret;
  return values;
};

module.exports = SystemUser;
