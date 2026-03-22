/**
 * Tenant DB model factory — registers all models on a given Sequelize instance
 * and sets up their associations.
 */

const defineUser = require('./User');
const defineBranch = require('./Branch');
const defineMember = require('./Member');
const defineKycDocument = require('./KycDocument');
const defineDepositAccount = require('./DepositAccount');
const defineDepositTransaction = require('./DepositTransaction');
const defineLoanApplication = require('./LoanApplication');
const defineLoanAccount = require('./LoanAccount');
const defineEmiPayment = require('./EmiPayment');
const defineTransaction = require('./Transaction');
const defineLedgerEntry = require('./LedgerEntry');
const defineNotification = require('./Notification');
const defineSupportTicket = require('./SupportTicket');
const defineUserSession = require('./UserSession');

const cache = new Map(); // db_name → models object

/**
 * Get (or build) all models for a tenant DB sequelize instance.
 * @param {import('sequelize').Sequelize} sequelize
 * @param {string} dbName
 */
const getTenantModels = (sequelize, dbName) => {
  if (cache.has(dbName)) return cache.get(dbName);

  const User = defineUser(sequelize);
  const Branch = defineBranch(sequelize);
  const Member = defineMember(sequelize);
  const KycDocument = defineKycDocument(sequelize);
  const DepositAccount = defineDepositAccount(sequelize);
  const DepositTransaction = defineDepositTransaction(sequelize);
  const LoanApplication = defineLoanApplication(sequelize);
  const LoanAccount = defineLoanAccount(sequelize);
  const EmiPayment = defineEmiPayment(sequelize);
  const Transaction = defineTransaction(sequelize);
  const LedgerEntry = defineLedgerEntry(sequelize);
  const Notification = defineNotification(sequelize);
  const SupportTicket = defineSupportTicket(sequelize); // Changed from `require('./SupportTicket')(sequelize)` to `defineSupportTicket(sequelize)` to match existing pattern
  const UserSession = defineUserSession(sequelize); // Add this line

  // ---- Associations ----
  // Branch ↔ User
  Branch.hasMany(User, { foreignKey: 'branch_id', as: 'users' }); // Changed 'staff' to 'users'
  User.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });

  // User ↔ UserSession
  User.hasMany(UserSession, { foreignKey: 'user_id', as: 'sessions' });
  UserSession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Branch ↔ Member
  Branch.hasMany(Member, { foreignKey: 'branch_id', as: 'members' });
  Member.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });

  // Member ↔ KycDocument
  Member.hasMany(KycDocument, { foreignKey: 'member_id', as: 'kycDocs' });
  KycDocument.belongsTo(Member, { foreignKey: 'member_id', as: 'member' });

  // Member ↔ DepositAccount
  Member.hasMany(DepositAccount, { foreignKey: 'member_id', as: 'depositAccounts' });
  DepositAccount.belongsTo(Member, { foreignKey: 'member_id', as: 'member' });

  // DepositAccount ↔ DepositTransaction
  DepositAccount.hasMany(DepositTransaction, { foreignKey: 'account_id', as: 'transactions' });
  DepositTransaction.belongsTo(DepositAccount, { foreignKey: 'account_id', as: 'account' });

  // Member ↔ LoanApplication
  Member.hasMany(LoanApplication, { foreignKey: 'member_id', as: 'loanApplications' });
  LoanApplication.belongsTo(Member, { foreignKey: 'member_id', as: 'member' });

  // LoanApplication ↔ LoanAccount
  LoanApplication.hasOne(LoanAccount, { foreignKey: 'application_id', as: 'loanAccount' });
  LoanAccount.belongsTo(LoanApplication, { foreignKey: 'application_id', as: 'application' });

  // LoanAccount ↔ EmiPayment
  LoanAccount.hasMany(EmiPayment, { foreignKey: 'loan_id', as: 'emiSchedule' });
  EmiPayment.belongsTo(LoanAccount, { foreignKey: 'loan_id', as: 'loan' });

  const models = {
    User, Branch, Member, KycDocument,
    DepositAccount, DepositTransaction,
    LoanApplication, LoanAccount, EmiPayment,
    Transaction, LedgerEntry, Notification, SupportTicket, UserSession,
    sequelize,
  };

  cache.set(dbName, models);
  return models;
};

const clearModelCache = (dbName) => cache.delete(dbName);

module.exports = { getTenantModels, clearModelCache };
