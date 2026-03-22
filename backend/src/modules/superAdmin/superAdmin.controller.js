const { sendSuccess, sendCreated, sendError, sendNotFound } = require('../../utils/response');
const { getPagination, paginateMeta, hashPassword } = require('../../utils/helpers');

/**
 * SuperAdmin Controller
 * Handles Organization Settings, User Management (Admin level), and Subscription view.
 */

// ── Organization Settings ──

const getOrganizationSettings = async (req, res) => {
  try {
    const tenant = req.tenant; // from tenantResolver
    return sendSuccess(res, { organization: tenant });
  } catch (err) {
    return sendError(res, 'Failed to fetch organization settings.');
  }
};

const updateOrganizationSettings = async (req, res) => {
  try {
    const tenant = req.tenant;
    const { name, email, phone, address, logo_url } = req.body;
    await tenant.update({ name, email, phone, address, logo_url });
    return sendSuccess(res, { organization: tenant }, 'Organization settings updated successfully.');
  } catch (err) {
    return sendError(res, 'Failed to update organization settings.');
  }
};

// ── User Management (SuperAdmin can manage ALL users, including Admins) ──

const listUsers = async (req, res) => {
  try {
    const { User, Branch } = req.db;
    const { page, limit, offset } = getPagination(req.query);
    const { role, is_active } = req.query;

    const where = {};
    if (role) where.role = role;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{ model: Branch, as: 'branch', attributes: ['id', 'name'] }],
      attributes: { exclude: ['password_hash', 'otp_secret'] },
      limit, offset,
      order: [['createdAt', 'DESC']],
    });

    return sendSuccess(res, { users: rows, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, 'Failed to fetch users.');
  }
};

const createUser = async (req, res) => {
  try {
    const { User } = req.db;
    const { name, email, phone, role, password, branch_id } = req.body;

    // SuperAdmin cannot create another SuperAdmin directly via this endpoint (only one exists usually)
    // But they can create Admins, BranchAdmins, etc.
    if (role === 'SuperAdmin') {
      return sendError(res, 'Cannot create another SuperAdmin.', 403);
    }

    const password_hash = await hashPassword(password);
    const user = await User.create({
      name, email, phone, role, password_hash, branch_id,
      must_change_password: true,
    });

    return sendCreated(res, { user: user.toJSON() }, `${role} created successfully.`);
  } catch (err) {
    return sendError(res, 'Failed to create user. ' + err.message);
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { User } = req.db;
    const user = await User.findByPk(req.params.id);
    if (!user) return sendNotFound(res, 'User not found.');

    if (user.role === 'SuperAdmin') {
      return sendError(res, 'Cannot modify SuperAdmin status.', 403);
    }

    await user.update({ is_active: req.body.is_active });
    return sendSuccess(res, { user: user.toJSON() }, `User status updated to ${req.body.is_active ? 'active' : 'inactive'}.`);
  } catch (err) {
    return sendError(res, 'Failed to update user status.');
  }
};

// ── Subscription View ──

const getMySubscription = async (req, res) => {
  try {
    const Subscription = require('../../../models/main/Subscription');
    const Plan = require('../../../models/main/Plan');

    const sub = await Subscription.findOne({
      where: { tenant_id: req.tenant.id, status: 'active' },
      include: [{ model: Plan, as: 'plan' }],
    });

    return sendSuccess(res, {
      subscription: sub,
      tenant_status: req.tenant.status,
      trial_ends_at: req.tenant.trial_ends_at,
    });
  } catch (err) {
    return sendError(res, 'Failed to fetch subscription.');
  }
};

module.exports = { getOrganizationSettings, updateOrganizationSettings, listUsers, createUser, updateUserStatus, getMySubscription };
