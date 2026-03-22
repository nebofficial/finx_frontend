const { sendSuccess, sendCreated, sendError, sendNotFound } = require('../../utils/response');
const { getPagination, paginateMeta, hashPassword } = require('../../utils/helpers');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

/**
 * Branch Management Controller
 * Admin creates and manages branches; BranchAdmin manages their own.
 */

const listBranches = async (req, res) => {
  try {
    const { Branch, User } = req.db;
    const { page, limit, offset } = getPagination(req.query);
    const where = {};

    // BranchAdmin sees only their branch
    if (req.user.role === 'BranchAdmin' && req.userBranchId) {
      where.id = req.userBranchId;
    }
    if (req.query.is_active !== undefined) where.is_active = req.query.is_active === 'true';

    const { count, rows } = await Branch.findAndCountAll({
      where,
      include: [{ model: User, as: 'staff', attributes: ['id', 'name', 'role'] }],
      limit, offset,
      order: [['name', 'ASC']],
    });

    return sendSuccess(res, { branches: rows, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, 'Failed to fetch branches.');
  }
};

const createBranch = async (req, res) => {
  try {
    const { Branch } = req.db;
    const branch = await Branch.create(req.body);
    return sendCreated(res, { branch }, 'Branch created.');
  } catch (err) {
    return sendError(res, 'Failed to create branch. ' + err.message);
  }
};

const updateBranch = async (req, res) => {
  try {
    const { Branch } = req.db;
    const branch = await Branch.findByPk(req.params.id);
    if (!branch) return sendNotFound(res, 'Branch not found.');
    await branch.update(req.body);
    return sendSuccess(res, { branch }, 'Branch updated.');
  } catch (err) {
    return sendError(res, 'Failed to update branch.');
  }
};

const toggleBranch = async (req, res) => {
  try {
    const { Branch } = req.db;
    const branch = await Branch.findByPk(req.params.id);
    if (!branch) return sendNotFound(res, 'Branch not found.');
    await branch.update({ is_active: !branch.is_active });
    return sendSuccess(res, { branch }, `Branch ${branch.is_active ? 'enabled' : 'disabled'}.`);
  } catch (err) {
    return sendError(res, 'Failed to toggle branch status.');
  }
};

// Assign a BranchAdmin to a branch
const assignManager = async (req, res) => {
  try {
    const { Branch, User } = req.db;
    const { user_id } = req.body;
    const branch = await Branch.findByPk(req.params.id);
    if (!branch) return sendNotFound(res, 'Branch not found.');
    const user = await User.findByPk(user_id);
    if (!user) return sendNotFound(res, 'User not found.');
    await branch.update({ manager_id: user_id });
    await user.update({ branch_id: branch.id, role: 'BranchAdmin' });
    return sendSuccess(res, { branch }, 'Manager assigned to branch.');
  } catch (err) {
    return sendError(res, 'Failed to assign manager.');
  }
};

// ── User Management (BranchAdmin can create FieldCollectors) ──

const listBranchUsers = async (req, res) => {
  try {
    const { User } = req.db;
    const where = { branch_id: req.userBranchId || req.params.branchId };
    const users = await User.findAll({ where, attributes: { exclude: ['password_hash'] } });
    return sendSuccess(res, { users });
  } catch (err) {
    return sendError(res, 'Failed to fetch branch users.');
  }
};

const createBranchUser = async (req, res) => {
  try {
    const { User } = req.db;
    const { name, email, phone, role, password } = req.body;

    // BranchAdmin can only create FieldCollector/Staff
    const allowedByBranchAdmin = ['FieldCollector', 'Staff'];
    if (req.user.role === 'BranchAdmin' && !allowedByBranchAdmin.includes(role)) {
      return sendError(res, 'BranchAdmin can only create FieldCollector or Staff accounts.', 403);
    }

    const password_hash = await hashPassword(password);
    const user = await User.create({
      name, email, phone, role, password_hash,
      branch_id: req.userBranchId || req.body.branch_id,
      must_change_password: true,
    });

    return sendCreated(res, { user: user.toJSON() }, 'User created successfully.');
  } catch (err) {
    return sendError(res, 'Failed to create user. ' + err.message);
  }
};

module.exports = { listBranches, createBranch, updateBranch, toggleBranch, assignManager, listBranchUsers, createBranchUser };
