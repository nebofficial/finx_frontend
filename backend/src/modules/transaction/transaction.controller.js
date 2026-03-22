const { sendSuccess, sendCreated, sendError, sendNotFound } = require('../../utils/response');
const { getPagination, paginateMeta } = require('../../utils/helpers');
const { Op } = require('sequelize');

/**
 * Transaction Controller
 * Handles viewing ledger transactions and creating standalone Receipts/Payments/Contras.
 */

const listTransactions = async (req, res) => {
  try {
    const { Transaction, Member, User } = req.db;
    const { page, limit, offset } = getPagination(req.query);
    const { type, member_id, branch_id, start_date, end_date } = req.query;

    const where = {};
    if (type) where.type = type;
    if (member_id) where.member_id = member_id;
    if (branch_id) where.branch_id = branch_id;
    
    // BranchAdmin restriction
    if (req.user.role === 'BranchAdmin' || req.user.role === 'FieldCollector') {
      where.branch_id = req.user.branch_id;
    }

    if (start_date && end_date) {
      where.transaction_date = { [Op.between]: [new Date(start_date), new Date(end_date)] };
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      include: [
        { model: Member, as: 'member', attributes: ['id', 'name', 'member_no'] },
        { model: User, as: 'created_by_user', attributes: ['id', 'name'] },
      ],
      limit, offset,
      order: [['transaction_date', 'DESC'], ['createdAt', 'DESC']],
    });

    return sendSuccess(res, { transactions: rows, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, 'Failed to fetch transactions.');
  }
};

const createTransaction = async (req, res) => {
  try {
    const { Transaction, LedgerEntry } = req.db;
    const sequelize = req.db.sequelize;

    const { type, amount, payment_method, reference_no, description, branch_id, member_id } = req.body;
    
    // Ensure accurate branch tracking
    const targetBranchId = (req.user.role === 'Admin' && branch_id) ? branch_id : req.user.branch_id;

    const transaction = await sequelize.transaction(async (t) => {
      // 1. Create the Transaction record
      const count = await Transaction.count({ transaction: t });
      const txn = await Transaction.create({
        transaction_no: `TXN-${String(count + 1).padStart(8, '0')}`,
        type, // e.g., 'receipt', 'payment', 'contra'
        amount,
        payment_method,
        reference_no,
        description,
        status: 'completed',
        transaction_date: new Date(),
        branch_id: targetBranchId,
        member_id: member_id || null, // Optional for general branch expenses
        created_by: req.user.id,
      }, { transaction: t });

      // 2. We skip double-entry ledger here for MVP, but normally you'd call LedgerEntry logic

      return txn;
    });

    return sendCreated(res, { transaction }, 'Transaction created successfully.');
  } catch (err) {
    return sendError(res, 'Failed to create transaction. ' + err.message);
  }
};

module.exports = { listTransactions, createTransaction };
