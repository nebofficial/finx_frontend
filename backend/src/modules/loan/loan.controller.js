const { sendSuccess, sendCreated, sendError, sendNotFound, sendBadRequest } = require('../../utils/response');
const { getPagination, paginateMeta } = require('../../utils/helpers');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

/**
 * Loan Management Controller
 * Application → Approval → Disbursement → EMI tracking
 */

// ── Applications ──

const listApplications = async (req, res) => {
  try {
    const { LoanApplication, Member, Branch } = req.db;
    const { page, limit, offset } = getPagination(req.query);
    const { status, branch_id } = req.query;

    const where = {};
    if (req.userBranchId) where.branch_id = req.userBranchId;
    else if (branch_id) where.branch_id = branch_id;
    if (status) where.status = status;

    const { count, rows } = await LoanApplication.findAndCountAll({
      where,
      include: [
        { model: Member, as: 'member', attributes: ['id', 'name', 'member_no'] },
        { model: Branch, as: 'branch', attributes: ['id', 'name'] },
      ],
      limit, offset,
      order: [['createdAt', 'DESC']],
    });

    return sendSuccess(res, { applications: rows, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, 'Failed to fetch loan applications.');
  }
};

const createApplication = async (req, res) => {
  try {
    const { LoanApplication, Member } = req.db;

    const member = await Member.findByPk(req.body.member_id);
    if (!member) return sendNotFound(res, 'Member not found.');

    const count = await LoanApplication.count();
    const application_no = `LA-${String(count + 1).padStart(8, '0')}`;

    const application = await LoanApplication.create({
      ...req.body,
      application_no,
      branch_id: req.body.branch_id || req.userBranchId,
      submitted_by: req.user.id,
      status: 'pending',
    });

    res.locals.resourceId = application.id;
    return sendCreated(res, { application }, 'Loan application submitted.');
  } catch (err) {
    return sendError(res, 'Failed to submit loan application. ' + err.message);
  }
};

const reviewApplication = async (req, res) => {
  try {
    const { LoanApplication } = req.db;
    const { action, rejection_reason } = req.body; // 'approve' | 'reject' | 'review'

    const application = await LoanApplication.findByPk(req.params.id);
    if (!application) return sendNotFound(res, 'Application not found.');
    if (!['pending', 'under_review'].includes(application.status)) {
      return sendBadRequest(res, 'Application cannot be modified in its current state.');
    }

    const updateData = {};
    if (action === 'review') {
      updateData.status = 'under_review';
      updateData.reviewed_by = req.user.id;
      updateData.reviewed_at = new Date();
    } else if (action === 'approve') {
      updateData.status = 'approved';
      updateData.approved_by = req.user.id;
      updateData.approved_at = new Date();
    } else if (action === 'reject') {
      updateData.status = 'rejected';
      updateData.rejection_reason = rejection_reason;
      updateData.approved_by = req.user.id;
      updateData.approved_at = new Date();
    } else {
      return sendBadRequest(res, 'Invalid action. Use: review, approve, reject.');
    }

    await application.update(updateData);
    return sendSuccess(res, { application }, `Application ${action}d successfully.`);
  } catch (err) {
    return sendError(res, 'Failed to process application.');
  }
};

const disburse = async (req, res) => {
  try {
    const { LoanApplication, LoanAccount, EmiPayment } = req.db;

    const application = await LoanApplication.findByPk(req.params.id);
    if (!application) return sendNotFound(res, 'Application not found.');
    if (application.status !== 'approved') {
      return sendBadRequest(res, 'Only approved applications can be disbursed.');
    }

    const { disbursement_mode = 'cash' } = req.body;

    // Calculate EMI schedule (reducing balance)
    const principal = parseFloat(application.amount_requested);
    const months = application.tenure_months;
    const annualRate = parseFloat(application.interest_rate);
    const monthlyRate = annualRate / 100 / 12;

    let emiAmount;
    if (monthlyRate === 0) {
      emiAmount = principal / months;
    } else {
      emiAmount = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                  (Math.pow(1 + monthlyRate, months) - 1);
    }

    const count = await LoanAccount.count();
    const loan_no = `LN-${String(count + 1).padStart(8, '0')}`;

    const disbursedDate = new Date();
    const totalInterest = (emiAmount * months) - principal;

    const loanAccount = await LoanAccount.create({
      loan_no,
      application_id: application.id,
      member_id: application.member_id,
      branch_id: application.branch_id,
      principal,
      outstanding_balance: principal + totalInterest,
      total_interest: totalInterest,
      emi_amount: parseFloat(emiAmount.toFixed(2)),
      tenure_months: months,
      interest_rate: application.interest_rate,
      interest_type: application.interest_type || 'reducing',
      disbursed_amount: principal,
      disbursed_date: disbursedDate,
      first_emi_date: new Date(disbursedDate.setMonth(disbursedDate.getMonth() + 1)),
      disbursed_by: req.user.id,
      disbursement_mode,
      status: 'active',
    });

    // Generate EMI schedule
    const emiSchedule = [];
    let balance = principal;
    const firstEmiDate = new Date(loanAccount.first_emi_date);

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principalPart = emiAmount - interest;
      balance -= principalPart;

      const dueDate = new Date(firstEmiDate);
      dueDate.setMonth(dueDate.getMonth() + (i - 1));

      emiSchedule.push({
        loan_id: loanAccount.id,
        member_id: application.member_id,
        branch_id: application.branch_id,
        emi_number: i,
        due_date: dueDate,
        emi_amount: parseFloat(emiAmount.toFixed(2)),
        principal_component: parseFloat(principalPart.toFixed(2)),
        interest_component: parseFloat(interest.toFixed(2)),
        status: 'pending',
      });
    }

    await EmiPayment.bulkCreate(emiSchedule);
    await application.update({ status: 'disbursed' });

    return sendSuccess(res, { loanAccount, emiCount: emiSchedule.length }, 'Loan disbursed and EMI schedule generated.');
  } catch (err) {
    logger.error('Disburse error:', err);
    return sendError(res, 'Failed to disburse loan. ' + err.message);
  }
};

const listLoanAccounts = async (req, res) => {
  try {
    const { LoanAccount, Member } = req.db;
    const { page, limit, offset } = getPagination(req.query);
    const where = {};
    if (req.userBranchId) where.branch_id = req.userBranchId;
    if (req.user.role === 'FieldCollector') where.collector_id = req.user.id;
    if (req.query.status) where.status = req.query.status;

    const { count, rows } = await LoanAccount.findAndCountAll({
      where,
      include: [{ model: Member, as: 'member', attributes: ['id', 'name', 'member_no', 'phone'] }],
      limit, offset,
      order: [['createdAt', 'DESC']],
    });

    return sendSuccess(res, { loans: rows, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, 'Failed to fetch loan accounts.');
  }
};

const getEmiSchedule = async (req, res) => {
  try {
    const { EmiPayment } = req.db;
    const emis = await EmiPayment.findAll({
      where: { loan_id: req.params.loanId },
      order: [['emi_number', 'ASC']],
    });
    return sendSuccess(res, { emis });
  } catch (err) {
    return sendError(res, 'Failed to fetch EMI schedule.');
  }
};

module.exports = { listApplications, createApplication, reviewApplication, disburse, listLoanAccounts, getEmiSchedule };
