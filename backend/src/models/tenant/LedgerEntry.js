const { DataTypes } = require('sequelize');

const defineLedgerEntry = (sequelize) => {
  const LedgerEntry = sequelize.define('LedgerEntry', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    account_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'COA code e.g., 1001, 2001, 3001',
    },
    account_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    account_type: {
      type: DataTypes.ENUM('Asset', 'Liability', 'Equity', 'Income', 'Expense'),
      allowNull: false,
    },
    ledger_type: {
      type: DataTypes.ENUM('GL', 'SubLedger', 'Cash', 'Bank'),
      defaultValue: 'GL',
    },
    debit: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    credit: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ref_transaction_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    branch_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    fiscal_year: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'e.g., 2024-2025',
    },
    entry_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    tableName: 'ledger_entries',
    timestamps: true,
    updatedAt: false, // ledger entries are immutable
  });

  return LedgerEntry;
};

module.exports = defineLedgerEntry;
