const { DataTypes } = require('sequelize');

const defineTransaction = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    txn_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    branch_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('receipt', 'payment', 'transfer', 'journal'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    from_account: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Ledger account code or account ID',
    },
    to_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    narration: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payment_mode: {
      type: DataTypes.ENUM('cash', 'bank', 'cheque', 'online'),
      defaultValue: 'cash',
    },
    cheque_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_ref: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'reversed'),
      defaultValue: 'pending',
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    approved_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    transaction_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ref_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Reference to deposit_transactions or emi_payments',
    },
    ref_type: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'e.g., DepositTransaction, EmiPayment',
    },
  }, {
    tableName: 'transactions',
    timestamps: true,
  });

  return Transaction;
};

module.exports = defineTransaction;
