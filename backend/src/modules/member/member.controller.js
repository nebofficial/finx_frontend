const { sendSuccess, sendCreated, sendError, sendNotFound, sendBadRequest } = require('../../utils/response');
const { getPagination, paginateMeta, hashPassword, generateToken } = require('../../utils/helpers');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

/**
 * Member Management Controller
 * Used by: Admin, BranchAdmin, FieldCollector (with scope restrictions)
 */

const listMembers = async (req, res) => {
  try {
    const { Member, Branch } = req.db;
    const { page, limit, offset } = getPagination(req.query);
    const { search, status, kyc_status, branch_id } = req.query;

    const where = {};

    // Branch scope — BranchAdmin and FieldCollector see only their branch
    if (req.userBranchId) where.branch_id = req.userBranchId;
    else if (branch_id) where.branch_id = branch_id;

    // FieldCollector sees only their assigned members
    if (req.user.role === 'FieldCollector') where.assigned_collector_id = req.user.id;

    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (status) where.status = status;
    if (kyc_status) where.kyc_status = kyc_status;

    const { count, rows } = await Member.findAndCountAll({
      where,
      include: [{ model: Branch, as: 'branch', attributes: ['id', 'name'] }],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return sendSuccess(res, { members: rows, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    logger.error(err);
    return sendError(res, 'Failed to fetch members.');
  }
};

const createMember = async (req, res) => {
  try {
    const { Member } = req.db;

    // Auto-generate member number
    const count = await Member.count();
    const member_no = `MEM-${String(count + 1).padStart(6, '0')}`;

    const member = await Member.create({
      ...req.body,
      member_no,
      branch_id: req.body.branch_id || req.userBranchId,
      registered_by: req.user.id,
      assigned_collector_id: req.user.role === 'FieldCollector' ? req.user.id : req.body.assigned_collector_id,
    });

    res.locals.resourceId = member.id;
    return sendCreated(res, { member }, 'Member registered successfully.');
  } catch (err) {
    logger.error(err);
    return sendError(res, 'Failed to register member. ' + err.message);
  }
};

const getMember = async (req, res) => {
  try {
    const { Member, KycDocument, DepositAccount, LoanAccount } = req.db;
    const where = { id: req.params.id };

    // Scope guard
    if (req.userBranchId) where.branch_id = req.userBranchId;
    if (req.user.role === 'FieldCollector') where.assigned_collector_id = req.user.id;

    const member = await Member.findOne({
      where,
      include: [
        { model: KycDocument, as: 'kycDocs' },
        { model: DepositAccount, as: 'depositAccounts' },
        { model: LoanAccount, as: 'loanAccounts' },
      ],
    });

    if (!member) return sendNotFound(res, 'Member not found.');
    return sendSuccess(res, { member });
  } catch (err) {
    return sendError(res, 'Failed to fetch member.');
  }
};

const updateMember = async (req, res) => {
  try {
    const { Member } = req.db;
    const member = await Member.findByPk(req.params.id);
    if (!member) return sendNotFound(res, 'Member not found.');

    // FieldCollector can only update limited fields
    if (req.user.role === 'FieldCollector') {
      const { phone, address } = req.body;
      await member.update({ phone, address });
    } else {
      await member.update(req.body);
    }

    return sendSuccess(res, { member }, 'Member updated successfully.');
  } catch (err) {
    return sendError(res, 'Failed to update member.');
  }
};

const updateMemberStatus = async (req, res) => {
  try {
    const { Member } = req.db;
    const { status } = req.body;
    const member = await Member.findByPk(req.params.id);
    if (!member) return sendNotFound(res, 'Member not found.');
    await member.update({ status });
    return sendSuccess(res, { member }, `Member ${status}.`);
  } catch (err) {
    return sendError(res, 'Failed to update member status.');
  }
};

const updateKycStatus = async (req, res) => {
  try {
    const { Member, KycDocument } = req.db;
    const { kyc_status, doc_id, is_verified } = req.body;
    const member = await Member.findByPk(req.params.id);
    if (!member) return sendNotFound(res, 'Member not found.');

    await member.update({ kyc_status });

    if (doc_id && is_verified !== undefined) {
      await KycDocument.update(
        { is_verified, verified_by: req.user.id, verified_at: new Date() },
        { where: { id: doc_id, member_id: member.id } }
      );
    }

    return sendSuccess(res, { member }, 'KYC status updated.');
  } catch (err) {
    return sendError(res, 'Failed to update KYC status.');
  }
};

module.exports = { listMembers, createMember, getMember, updateMember, updateMemberStatus, updateKycStatus };
