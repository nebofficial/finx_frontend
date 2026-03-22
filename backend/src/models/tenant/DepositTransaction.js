const { DataTypes } = require('sequelize');

const defineDepositTransaction = (sequelize) => {
  const DepositTransaction = sequelize.define('DepositTransaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    receipt_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    account_id: {
      type: DataTypes.UUID,
      allowNull: false,
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
      type: DataTypes.ENUM('deposit', 'withdrawal', 'interest_credit', 'penalty'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    balance_after: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Account balance after this transaction',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payment_mode: {
      type: DataTypes.ENUM('cash', 'bank_transfer', 'cheque', 'online'),
      defaultValue: 'cash',
    },
    reference_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    collected_by: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'FieldCollector or Staff user ID',
    },
    approved_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'reversed'),
      defaultValue: 'approved',
    },
    transaction_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'deposit_transactions',
    timestamps: true,
  });

  return DepositTransaction;
};

module.exports = defineDepositTransaction;
