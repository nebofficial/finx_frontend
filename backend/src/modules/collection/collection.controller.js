const { sendSuccess, sendCreated, sendError, sendNotFound, sendBadRequest } = require('../../utils/response');
const { getPagination, paginateMeta } = require('../../utils/helpers');
const logger = require('../../utils/logger');

/**
 * FieldCollector — EMI Collection Controller
 * FieldCollectors collect daily EMIs, record collections, and submit reports.
 */

/**
 * Collect an EMI payment for an assigned loan.
 */
const collectEmi = async (req, res) => {
  try {
    const { EmiPayment, LoanAccount } = req.db;
    const { emi_id, paid_amount, payment_mode = 'cash', remarks } = req.body;

    const emi = await EmiPayment.findByPk(emi_id);
    if (!emi) return sendNotFound(res, 'EMI not found.');
    if (emi.status === 'paid') return sendBadRequest(res, 'EMI already paid.');

    // Verify FieldCollector is assigned to this loan
    if (req.user.role === 'FieldCollector') {
      const loan = await LoanAccount.findByPk(emi.loan_id);
      if (!loan || loan.collector_id !== req.user.id) {
        return sendError(res, 'You are not assigned to collect this loan.', 403);
      }
    }

    const count = await EmiPayment.count({ where: { status: 'paid' } });
    const receipt_no = `EMI-${String(count + 1).padStart(10, '0')}`;

    const totalDue = parseFloat(emi.emi_amount) + parseFloat(emi.penalty_amount || 0);
    const paidAmt = parseFloat(paid_amount);

    const isFullyPaid = paidAmt >= totalDue;
    const newStatus = isFullyPaid ? 'paid' : (paidAmt > 0 ? 'partial' : emi.status);

    await emi.update({
      paid_amount: paidAmt,
      paid_date: new Date(),
      status: newStatus,
      payment_mode,
      receipt_no,
      collected_by: req.user.id,
      remarks,
    });

    // Update loan outstanding balance if fully paid
    if (isFullyPaid) {
      const loan = await LoanAccount.findByPk(emi.loan_id);
      const newBalance = Math.max(0, parseFloat(loan.outstanding_balance) - parseFloat(emi.principal_component));

      // Check if all EMIs are paid
      const { EmiPayment: EP } = req.db;
      const unpaidCount = await EP.count({ where: { loan_id: loan.id, status: ['pending', 'overdue', 'partial'] } });

      await loan.update({
        outstanding_balance: newBalance,
        status: unpaidCount === 0 ? 'closed' : loan.status,
        closed_date: unpaidCount === 0 ? new Date() : null,
      });
    }

    res.locals.resourceId = emi.id;
    return sendSuccess(res, { emi, receipt_no }, `EMI ${newStatus}. Receipt: ${receipt_no}`);
  } catch (err) {
    logger.error('EMI collection error:', err);
    return sendError(res, 'Failed to collect EMI. ' + err.message);
  }
};

/**
 * View assigned members and their overdue EMIs (FieldCollector's route list).
 */
const getMyCollections = async (req, res) => {
  try {
    const { Member, LoanAccount, EmiPayment } = req.db;
    const { Op } = require('sequelize');

    const assignedLoans = await LoanAccount.findAll({
      where: {
        collector_id: req.user.id,
        status: 'active',
      },
      include: [
        { model: Member, as: 'member', attributes: ['id', 'name', 'phone'] },
        {
          model: EmiPayment,
          as: 'emiSchedule',
          where: { status: ['pending', 'overdue', 'partial'] },
          required: false,
          order: [['due_date', 'ASC']],
          limit: 3,
        },
      ],
    });

    return sendSuccess(res, { loans: assignedLoans, total: assignedLoans.length });
  } catch (err) {
    return sendError(res, 'Failed to fetch collection list.');
  }
};

/**
 * Daily collection summary for FieldCollector.
 */
const getDailySummary = async (req, res) => {
  try {
    const { EmiPayment, DepositTransaction } = req.db;
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));
    const { Op, fn, col } = require('sequelize');

    const emiCollections = await EmiPayment.findAll({
      where: {
        collected_by: req.user.id,
        paid_date: { [Op.between]: [start, end] },
        status: ['paid', 'partial'],
      },
      attributes: [
        [fn('SUM', col('paid_amount')), 'total_emi'],
        [fn('COUNT', col('id')), 'count'],
      ],
      raw: true,
    });

    const depositCollections = await DepositTransaction.findAll({
      where: {
        collected_by: req.user.id,
        transaction_date: { [Op.between]: [start, end] },
        type: 'deposit',
      },
      attributes: [
        [fn('SUM', col('amount')), 'total_deposits'],
        [fn('COUNT', col('id')), 'count'],
      ],
      raw: true,
    });

    return sendSuccess(res, {
      date: new Date().toISOString().split('T')[0],
      emi: emiCollections[0],
      deposits: depositCollections[0],
    });
  } catch (err) {
    return sendError(res, 'Failed to fetch daily summary.');
  }
};

/**
 * Bulk assign loans to a FieldCollector (Route & Assignment API).
 * Used by Admin / BranchAdmin.
 */
const assignCollector = async (req, res) => {
  try {
    const { LoanAccount } = req.db;
    const { loan_ids, collector_id } = req.body;

    if (!Array.isArray(loan_ids) || loan_ids.length === 0) {
      return sendBadRequest(res, 'loan_ids array is required.');
    }

    // BranchAdmin can only assign loans within their branch
    const where = { id: loan_ids };
    if (req.user.role === 'BranchAdmin') {
      where.branch_id = req.user.branch_id;
    }

    const [updatedCount] = await LoanAccount.update(
      { collector_id },
      { where }
    );

    return sendSuccess(res, { updated_count: updatedCount }, `Successfully assigned ${updatedCount} loans to collector.`);
  } catch (err) {
    return sendError(res, 'Failed to assign collector.');
  }
};

module.exports = { collectEmi, getMyCollections, getDailySummary, assignCollector };
