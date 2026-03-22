const { DataTypes } = require('sequelize');

const defineLoanApplication = (sequelize) => {
  const LoanApplication = sequelize.define('LoanApplication', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    application_no: {
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
    loan_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'e.g., Personal, Business, Agriculture, Housing',
    },
    amount_requested: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    purpose: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    collateral: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    guarantor_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Another member acting as guarantor',
    },
    status: {
      type: DataTypes.ENUM('pending', 'under_review', 'approved', 'rejected', 'disbursed', 'cancelled'),
      defaultValue: 'pending',
    },
    reviewed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    submitted_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    documents: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of uploaded document URLs',
    },
  }, {
    tableName: 'loan_applications',
    timestamps: true,
  });

  return LoanApplication;
};

module.exports = defineLoanApplication;
