const { DataTypes } = require('sequelize');

/**
 * Define the User model for a tenant DB.
 * @param {import('sequelize').Sequelize} sequelize - The tenant Sequelize instance
 */
const defineUser = (sequelize) => {
  const User = sequelize.define('User', {
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
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('SuperAdmin', 'Admin', 'BranchAdmin', 'FieldCollector', 'Staff'),
      allowNull: false,
    },
    branch_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Null for SuperAdmin / Admin; set for BranchAdmin & FieldCollector',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
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
    must_change_password: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    device_tokens: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'Push notification tokens per device',
    },
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
  });

  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password_hash;
    return values;
  };

  return User;
};

module.exports = defineUser;
