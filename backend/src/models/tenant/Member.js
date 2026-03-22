const { DataTypes } = require('sequelize');

const defineMember = (sequelize) => {
  const Member = sequelize.define('Member', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    member_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    branch_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assigned_collector_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'FieldCollector assigned to this member',
    },
    kyc_status: {
      type: DataTypes.ENUM('pending', 'submitted', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'pending'),
      defaultValue: 'pending',
    },
    join_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    registered_by: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User ID who registered this member',
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nominee_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nominee_relation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    tableName: 'members',
    timestamps: true,
    paranoid: true,
  });

  return Member;
};

module.exports = defineMember;
