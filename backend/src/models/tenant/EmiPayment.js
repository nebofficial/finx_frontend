const { DataTypes } = require('sequelize');

const defineEmiPayment = (sequelize) => {
  const EmiPayment = sequelize.define('EmiPayment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    loan_id: {
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
    emi_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    emi_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    principal_component: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    interest_component: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    penalty_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    paid_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    paid_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'partial', 'overdue', 'waived'),
      defaultValue: 'pending',
    },
    payment_mode: {
      type: DataTypes.ENUM('cash', 'bank_transfer', 'cheque', 'online'),
      allowNull: true,
    },
    receipt_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    collected_by: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'FieldCollector who collected this EMI',
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'emi_payments',
    timestamps: true,
  });

  return EmiPayment;
};

module.exports = defineEmiPayment;
