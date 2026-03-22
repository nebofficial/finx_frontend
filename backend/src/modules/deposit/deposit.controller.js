const { sendSuccess, sendCreated, sendError, sendNotFound, sendBadRequest } = require('../../utils/response');
const { getPagination, paginateMeta } = require('../../utils/helpers');
const logger = require('../../utils/logger');

/**
 * Deposit Management Controller
 * Handles Saving, FD, Recurring deposit accounts and transactions.
 */

const listAccounts = async (req, res) => {
  try {
    const { DepositAccount, Member } = req.db;
    const { page, limit, offset } = getPagination(req.query);
    const where = {};
    if (req.userBranchId) where.branch_id = req.userBranchId;
    if (req.query.member_id) where.member_id = req.query.member_id;
    if (req.query.type) where.type = req.query.type;
    if (req.query.status) where.status = req.query.status;

    const { count, rows } = await DepositAccount.findAndCountAll({
      where,
      include: [{ model: Member, as: 'member', attributes: ['id', 'name', 'member_no'] }],
      limit, offset,
      order: [['createdAt', 'DESC']],
    });

    return sendSuccess(res, { accounts: rows, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, 'Failed to fetch deposit accounts.');
  }
};

const createAccount = async (req, res) => {
  try {
    const { DepositAccount, Member } = req.db;
    const member = await Member.findByPk(req.body.member_id);
    if (!member) return sendNotFound(res, 'Member not found.');

    const count = await DepositAccount.count();
    const account_no = `DA-${String(count + 1).padStart(8, '0')}`;

    const account = await DepositAccount.create({
      ...req.body,
      account_no,
      branch_id: req.body.branch_id || req.userBranchId,
      opened_by: req.user.id,
    });

    res.locals.resourceId = account.id;
    return sendCreated(res, { account }, 'Deposit account created.');
  } catch (err) {
    return sendError(res, 'Failed to create deposit account. ' + err.message);
  }
};

const deposit = async (req, res) => {
  try {
    const { DepositAccount, DepositTransaction } = req.db;
    const { account_id, amount, payment_mode = 'cash', description } = req.body;

    const account = await DepositAccount.findByPk(account_id);
    if (!account) return sendNotFound(res, 'Account not found.');
    if (account.status !== 'active') return sendBadRequest(res, 'Account is not active.');

    const newBalance = parseFloat(account.balance) + parseFloat(amount);

    const count = await DepositTransaction.count();
    const receipt_no = `DR-${String(count + 1).padStart(10, '0')}`;

    const txn = await DepositTransaction.create({
      receipt_no,
      account_id,
      member_id: account.member_id,
      branch_id: account.branch_id,
      type: 'deposit',
      amount,
      balance_after: newBalance,
      description,
      payment_mode,
      collected_by: req.user.id,
      status: 'approved',
    });

    await account.update({ balance: newBalance });

    return sendCreated(res, { transaction: txn, new_balance: newBalance }, 'Deposit recorded successfully.');
  } catch (err) {
    return sendError(res, 'Failed to record deposit. ' + err.message);
  }
};

const withdraw = async (req, res) => {
  try {
    const { DepositAccount, DepositTransaction } = req.db;
    const { account_id, amount, payment_mode = 'cash', description } = req.body;

    const account = await DepositAccount.findByPk(account_id);
    if (!account) return sendNotFound(res, 'Account not found.');
    if (account.status !== 'active') return sendBadRequest(res, 'Account is not active.');

    const balance = parseFloat(account.balance);
    const withdrawAmt = parseFloat(amount);
    const minBalance = parseFloat(account.minimum_balance);

    if (balance - withdrawAmt < minBalance) {
      return sendBadRequest(res, `Insufficient balance. Minimum balance required: ${minBalance}`);
    }

    const newBalance = balance - withdrawAmt;
    const count = await DepositTransaction.count();
    const receipt_no = `DW-${String(count + 1).padStart(10, '0')}`;

    const txn = await DepositTransaction.create({
      receipt_no,
      account_id,
      member_id: account.member_id,
      branch_id: account.branch_id,
      type: 'withdrawal',
      amount: withdrawAmt,
      balance_after: newBalance,
      description,
      payment_mode,
      collected_by: req.user.id,
      status: 'approved',
    });

    await account.update({ balance: newBalance });
    return sendCreated(res, { transaction: txn, new_balance: newBalance }, 'Withdrawal processed.');
  } catch (err) {
    return sendError(res, 'Failed to process withdrawal. ' + err.message);
  }
};

const getStatement = async (req, res) => {
  try {
    const { DepositTransaction, DepositAccount } = req.db;
    const { page, limit, offset } = getPagination(req.query);
    const { from_date, to_date } = req.query;

    const where = { account_id: req.params.accountId };
    if (from_date) where.transaction_date = { ...(where.transaction_date || {}), [require('sequelize').Op.gte]: new Date(from_date) };
    if (to_date) where.transaction_date = { ...(where.transaction_date || {}), [require('sequelize').Op.lte]: new Date(to_date) };

    const account = await DepositAccount.findByPk(req.params.accountId);
    if (!account) return sendNotFound(res, 'Account not found.');

    const { count, rows } = await DepositTransaction.findAndCountAll({
      where,
      limit, offset,
      order: [['transaction_date', 'DESC']],
    });

    return sendSuccess(res, { account, transactions: rows, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, 'Failed to fetch statement.');
  }
};

module.exports = { listAccounts, createAccount, deposit, withdraw, getStatement };
