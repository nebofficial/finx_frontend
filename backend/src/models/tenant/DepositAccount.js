const { DataTypes } = require('sequelize');

const defineDepositAccount = (sequelize) => {
  const DepositAccount = sequelize.define('DepositAccount', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    account_no: {
      type: DataTypes.STRING(50),
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
    type: {
      type: DataTypes.ENUM('Saving', 'Fixed Deposit', 'Recurring', 'Current'),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    interest_rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      comment: 'Annual interest rate in percent',
    },
    minimum_balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    maturity_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'For Fixed Deposit accounts',
    },
    maturity_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'closed', 'frozen', 'matured'),
      defaultValue: 'active',
    },
    opened_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    opened_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    last_interest_credited_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'deposit_accounts',
    timestamps: true,
  });

  return DepositAccount;
};

module.exports = defineDepositAccount;
