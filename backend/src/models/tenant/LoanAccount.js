const { DataTypes } = require('sequelize');

const defineLoanAccount = (sequelize) => {
  const LoanAccount = sequelize.define('LoanAccount', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    loan_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    branch_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    principal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    outstanding_balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    total_interest: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    emi_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    tenure_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    interest_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    interest_type: {
      type: DataTypes.ENUM('flat', 'reducing'),
      defaultValue: 'reducing',
    },
    disbursed_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    disbursed_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    first_emi_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    disbursed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    disbursement_mode: {
      type: DataTypes.ENUM('cash', 'bank_transfer', 'cheque'),
      defaultValue: 'cash',
    },
    status: {
      type: DataTypes.ENUM('active', 'closed', 'overdue', 'written_off', 'npa'),
      defaultValue: 'active',
    },
    collector_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Assigned FieldCollector',
    },
    closed_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    overdue_days: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    penalty_rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
  }, {
    tableName: 'loan_accounts',
    timestamps: true,
  });

  return LoanAccount;
};

module.exports = defineLoanAccount;
