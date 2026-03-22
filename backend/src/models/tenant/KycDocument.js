const { DataTypes } = require('sequelize');

const defineKycDocument = (sequelize) => {
  const KycDocument = sequelize.define('KycDocument', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    doc_type: {
      type: DataTypes.ENUM('national_id', 'passport', 'driving_license', 'voter_id', 'photo', 'signature', 'other'),
      allowNull: false,
    },
    doc_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verified_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    uploaded_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    tableName: 'kyc_documents',
    timestamps: true,
  });

  return KycDocument;
};

module.exports = defineKycDocument;
