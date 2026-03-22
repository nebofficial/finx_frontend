const { DataTypes } = require('sequelize');

const defineBranch = (sequelize) => {
  const Branch = sequelize.define('Branch', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    manager_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'BranchAdmin user ID',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    opening_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    tableName: 'branches',
    timestamps: true,
    paranoid: true,
  });

  return Branch;
};

module.exports = defineBranch;
