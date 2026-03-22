const { sendSuccess, sendCreated, sendError } = require('../../utils/response');
const { getPagination, paginateMeta } = require('../../utils/helpers');
const logger = require('../../utils/logger');

/**
 * Ledger / Accounting Controller
 * Provides GL view, sub-ledger, cash/bank ledger, and trial balance.
 */

const listLedgerEntries = async (req, res) => {
  try {
    const { LedgerEntry } = req.db;
    const { page, limit, offset } = getPagination(req.query);
    const { ledger_type, account_type, from_date, to_date, account_code } = req.query;
    const { Op } = require('sequelize');

    const where = {};
    if (req.userBranchId) where.branch_id = req.userBranchId;
    if (ledger_type) where.ledger_type = ledger_type;
    if (account_type) where.account_type = account_type;
    if (account_code) where.account_code = account_code;
    if (from_date) where.entry_date = { ...(where.entry_date || {}), [Op.gte]: new Date(from_date) };
    if (to_date) where.entry_date = { ...(where.entry_date || {}), [Op.lte]: new Date(to_date) };

    const { count, rows } = await LedgerEntry.findAndCountAll({
      where,
      limit, offset,
      order: [['entry_date', 'DESC']],
    });

    return sendSuccess(res, { entries: rows, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, 'Failed to fetch ledger entries.');
  }
};

const getTrialBalance = async (req, res) => {
  try {
    const { LedgerEntry } = req.db;
    const { fn, col, literal } = require('sequelize');
    const where = {};
    if (req.userBranchId) where.branch_id = req.userBranchId;
    if (req.query.fiscal_year) where.fiscal_year = req.query.fiscal_year;

    const rows = await LedgerEntry.findAll({
      where,
      attributes: [
        'account_code',
        'account_name',
        'account_type',
        [fn('SUM', col('debit')), 'total_debit'],
        [fn('SUM', col('credit')), 'total_credit'],
        [literal('SUM(debit) - SUM(credit)'), 'net_balance'],
      ],
      group: ['account_code', 'account_name', 'account_type'],
      order: [['account_code', 'ASC']],
      raw: true,
    });

    const totals = rows.reduce((acc, row) => ({
      total_debit: acc.total_debit + parseFloat(row.total_debit || 0),
      total_credit: acc.total_credit + parseFloat(row.total_credit || 0),
    }), { total_debit: 0, total_credit: 0 });

    return sendSuccess(res, { trial_balance: rows, totals });
  } catch (err) {
    return sendError(res, 'Failed to generate trial balance.');
  }
};

/**
 * Post a journal/transaction entry and create double-entry ledger records.
 */
const postJournalEntry = async (req, res) => {
  try {
    const { LedgerEntry, Transaction } = req.db;
    const { entries, narration, ref_transaction_id } = req.body;
    // entries: [{ account_code, account_name, account_type, ledger_type, debit, credit }]

    const totalDebit = entries.reduce((s, e) => s + parseFloat(e.debit || 0), 0);
    const totalCredit = entries.reduce((s, e) => s + parseFloat(e.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return sendError(res, 'Journal entry is not balanced. Total debit must equal total credit.', 400);
    }

    const created = await LedgerEntry.bulkCreate(entries.map(e => ({
      ...e,
      description: narration,
      ref_transaction_id,
      branch_id: req.userBranchId || req.body.branch_id,
      fiscal_year: req.body.fiscal_year,
      created_by: req.user.id,
    })));

    return sendCreated(res, { entries: created }, 'Journal entry posted successfully.');
  } catch (err) {
    return sendError(res, 'Failed to post journal entry. ' + err.message);
  }
};

module.exports = { listLedgerEntries, getTrialBalance, postJournalEntry };
