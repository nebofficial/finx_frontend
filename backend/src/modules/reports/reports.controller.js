const { sendSuccess, sendError } = require('../../utils/response');
const { Op } = require('sequelize');

/**
 * Reports Controller
 * Aggregate data for BranchAdmins and Admins (Dashboard analytics).
 */

const getDashboardSummary = async (req, res) => {
  try {
    const { Member, LoanAccount, DepositAccount, Transaction } = req.db;
    const { branch_id } = req.query;

    const whereBranch = {};
    if (req.user.role === 'BranchAdmin') {
      whereBranch.branch_id = req.user.branch_id;
    } else if (branch_id) {
      whereBranch.branch_id = branch_id;
    }

    // Quick Stats
    const totalMembers = await Member.count({ where: whereBranch });
    
    const activeLoans = await LoanAccount.count({ 
      where: { ...whereBranch, status: 'active' } 
    });

    const activeDeposits = await DepositAccount.count({ 
      where: { ...whereBranch, status: 'active' } 
    });

    // Today's Collection
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCollections = await Transaction.sum('amount', {
      where: {
        ...whereBranch,
        type: 'receipt', // Assuming EMI collections and deposits are receipts
        transaction_date: { [Op.gte]: today }
      }
    });

    return sendSuccess(res, {
      summary: {
        total_members: totalMembers,
        active_loans: activeLoans,
        active_deposits: activeDeposits,
        today_collections: todayCollections || 0,
      }
    });

  } catch (err) {
    return sendError(res, 'Failed to fetch dashboard summary.');
  }
};

const getCollectionByCollector = async (req, res) => {
  try {
    const { Transaction, User } = req.db;
    const { start_date, end_date } = req.query;

    const where = { type: 'receipt' }; // Collections only

    if (req.user.role === 'BranchAdmin') {
      where.branch_id = req.user.branch_id;
    }

    if (start_date && end_date) {
      where.transaction_date = { [Op.between]: [new Date(start_date), new Date(end_date)] };
    }

    const collections = await Transaction.findAll({
      where,
      attributes: [
        'created_by',
        [req.db.sequelize.fn('SUM', req.db.sequelize.col('amount')), 'total_collected'],
        [req.db.sequelize.fn('COUNT', req.db.sequelize.col('id')), 'transaction_count']
      ],
      include: [{ model: User, as: 'creator_user', attributes: ['name'] }], // Note: we need creator_user association in Transaction
      group: ['created_by', 'creator_user.id', 'creator_user.name']
    });

    return sendSuccess(res, { collections });
  } catch (err) {
    return sendError(res, 'Failed to fetch collector reports.');
  }
};

module.exports = { getDashboardSummary, getCollectionByCollector };
