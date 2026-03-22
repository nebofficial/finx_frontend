const SystemUser = require('../../models/main/SystemUser');
const Tenant = require('../../models/main/Tenant');
const { getTenantDb } = require('../../config/tenantDb');
const { getTenantModels } = require('../../models/tenant/index');
const { comparePassword } = require('../../utils/helpers');
const { signPlatformToken, signTenantToken, signRefreshToken, verifyRefreshToken } = require('../../services/jwtService');
const { sendSuccess, sendUnauthorized, sendBadRequest, sendError } = require('../../utils/response');
const logger = require('../../utils/logger');

/**
 * POST /api/auth/platform/login
 * Login for SystemAdmin and Support users (platform layer — main DB).
 */
const platformLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await SystemUser.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !user.is_active) {
      return sendUnauthorized(res, 'Invalid credentials or account is inactive.');
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return sendUnauthorized(res, 'Invalid credentials.');
    }

    // Update last login
    await user.update({ last_login_at: new Date(), last_login_ip: req.ip });

    const { token, jti: accessJti } = signPlatformToken(user);
    const { token: refreshToken } = signRefreshToken(user.id, 'platform');

    return sendSuccess(res, {
      token,
      refreshToken,
      user: user.toJSON(),
    }, 'Platform login successful');
  } catch (err) {
    logger.error('Platform login error:', err);
    return sendError(res, 'Login failed. Please try again.');
  }
};

/**
 * POST /api/auth/login
 * Login for tenant users: SuperAdmin, Admin, BranchAdmin, FieldCollector.
 * Requires body: { email, password, tenant_slug }
 */
const tenantLogin = async (req, res) => {
  try {
    const { email, password, tenant_slug } = req.body;

    // 1: Find tenant by slug
    const tenant = await Tenant.findOne({ where: { slug: tenant_slug } });
    if (!tenant) {
      return sendBadRequest(res, 'Cooperative not found. Please check your organization identifier.');
    }

    // 2: Check tenant status
    if (['suspended', 'deleted', 'inactive'].includes(tenant.status)) {
      return sendUnauthorized(res, `Account ${tenant.status}. Please contact support.`);
    }

    if (tenant.status === 'trial' && tenant.trial_ends_at && new Date() > new Date(tenant.trial_ends_at)) {
      return sendUnauthorized(res, 'Trial period expired. Please contact your administrator to upgrade.');
    }

    // 3: Connect to tenant DB and find user
    const tenantSequelize = getTenantDb(tenant.db_name);
    const { User } = getTenantModels(tenantSequelize, tenant.db_name);

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !user.is_active) {
      return sendUnauthorized(res, 'Invalid credentials or account is inactive.');
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return sendUnauthorized(res, 'Invalid credentials.');
    }

    // 4: Update last login
    await user.update({ last_login_at: new Date(), last_login_ip: req.ip });

    // 5: Generate JWT
    const { token, jti: accessJti } = signTenantToken(user, tenant.id);
    const { token: refreshToken } = signRefreshToken(user.id, 'tenant');

    // 6: Record Session
    const { UserSession } = getTenantModels(tenantSequelize, tenant.db_name);
    await UserSession.create({
      user_id: user.id,
      token_id: accessJti,
      device_info: req.headers['user-agent'] || 'Unknown Device',
      ip_address: req.ip,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // match JWT expiry e.g 1d
    });

    return sendSuccess(res, {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch_id: user.branch_id,
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        status: tenant.status,
      },
    }, 'Login successful');
  } catch (err) {
    logger.error('Tenant login error:', err);
    return sendError(res, 'Login failed. Please try again.');
  }
};

/**
 * POST /api/auth/refresh
 * Refresh access token using a valid refresh token.
 */
const refreshToken = async (req, res) => {
  try {
    const { refresh_token, type = 'tenant', tenant_slug } = req.body;

    const decoded = verifyRefreshToken(refresh_token);

    let responseToken;
    if (decoded.type === 'platform') {
      const user = await SystemUser.findByPk(decoded.user_id);
      if (!user || !user.is_active) return sendUnauthorized(res, 'User not found or inactive.');
      const { token } = signPlatformToken(user);
      responseToken = token;
    } else {
      const tenant = await Tenant.findOne({ where: { slug: tenant_slug } });
      if (!tenant) return sendBadRequest(res, 'Tenant not found.');
      const tenantSequelize = getTenantDb(tenant.db_name);
      const { User, UserSession } = getTenantModels(tenantSequelize, tenant.db_name);
      
      const user = await User.findByPk(decoded.user_id);
      if (!user || !user.is_active) return sendUnauthorized(res, 'User not found or inactive.');
      
      const { token, jti: accessJti } = signTenantToken(user, tenant.id);
      responseToken = token;

      // Record new session for refreshed token
      await UserSession.create({
        user_id: user.id,
        token_id: accessJti,
        device_info: req.headers['user-agent'] || 'Unknown Device (Refresh)',
        ip_address: req.ip,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    }

    return sendSuccess(res, { token: responseToken }, 'Token refreshed');
  } catch (err) {
    return sendUnauthorized(res, 'Invalid or expired refresh token.');
  }
};

/**
 * POST /api/auth/forgot-password
 * Request OTP for password reset (Tenant only for now, platform is similar).
 */
const forgotPassword = async (req, res) => {
  try {
    const { email, tenant_slug } = req.body;
    
    const tenant = await Tenant.findOne({ where: { slug: tenant_slug } });
    if (!tenant) return sendBadRequest(res, 'Tenant not found.');
    if (tenant.status !== 'active' && tenant.status !== 'trial') {
      return sendError(res, 'Tenant account is not active.', 403);
    }

    const { User } = getTenantModels(getTenantDb(tenant.db_name), tenant.db_name);
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      // Return success anyway to avoid email enumeration
      return sendSuccess(res, null, 'If that email exists, an OTP has been sent.');
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await user.update({ otp_secret: otp });
    
    // TODO: Send OTP via notificationService (email/sms)
    logger.info(`OTP for ${user.email} is ${otp}`); // For dev purposes

    return sendSuccess(res, null, 'If that email exists, an OTP has been sent.');
  } catch (err) {
    logger.error('Forgot password error:', err);
    return sendError(res, 'Failed to process request.');
  }
};

/**
 * POST /api/auth/verify-otp
 */
const verifyOtp = async (req, res) => {
  try {
    const { email, tenant_slug, otp } = req.body;
    
    const tenant = await Tenant.findOne({ where: { slug: tenant_slug } });
    if (!tenant) return sendBadRequest(res, 'Tenant not found.');

    const { User } = getTenantModels(getTenantDb(tenant.db_name), tenant.db_name);
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || user.otp_secret !== otp) {
      return sendError(res, 'Invalid OTP.', 400);
    }

    // OTP matched, generate a temporary reset token (valid for 15 mins)
    const resetToken = signTenantToken(user, tenant.id);
    await user.update({ otp_secret: null }); // Clear OTP

    return sendSuccess(res, { reset_token: resetToken }, 'OTP verified successfully.');
  } catch (err) {
    return sendError(res, 'Failed to verify OTP.');
  }
};

/**
 * POST /api/auth/reset-password
 * Requires Bearer Token (it can be the temporary reset_token from verifyOtp)
 */
const resetPassword = async (req, res) => {
  try {
    const { new_password } = req.body;
    const { hashPassword } = require('../../utils/helpers');

    if (req.user.type !== 'tenant') return sendError(res, 'Platform reset not supported here.', 400);

    const tenant = await Tenant.findByPk(req.user.tenantId);
    const { User } = getTenantModels(getTenantDb(tenant.db_name), tenant.db_name);
    
    const user = await User.findByPk(req.user.id);
    if (!user) return sendNotFound(res, 'User not found.');

    const password_hash = await hashPassword(new_password);
    await user.update({ password_hash, must_change_password: false });

    return sendSuccess(res, null, 'Password reset successful. You can now login.');
  } catch (err) {
    return sendError(res, 'Failed to reset password.');
  }
};

/**
 * POST /api/auth/impersonate
 * SuperAdmin impersonates a tenant user (Admin, BranchAdmin, etc).
 */
const impersonate = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Must be auth'd as SuperAdmin or SystemAdmin
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'SystemAdmin') {
      return sendError(res, 'Only SuperAdmin or SystemAdmin can impersonate.', 403);
    }

    const tenant = await Tenant.findByPk(req.user.tenantId);
    if (!tenant) return sendBadRequest(res, 'Tenant context missing.');

    const { User } = getTenantModels(getTenantDb(tenant.db_name), tenant.db_name);
    
    // Find target user
    const targetUser = await User.findByPk(user_id);
    if (!targetUser) return sendNotFound(res, 'Target user not found.');

    if (targetUser.role === 'SuperAdmin') {
      return sendError(res, 'Cannot impersonate another SuperAdmin.', 403);
    }

    // Generate token for targetUser but embed impersonator id
    const { token } = signTenantToken(targetUser, tenant.id);
    // Note: We could add impersonator_id to the token payload if needed, but for MVP standard token works

    logger.info(`User ${req.user.id} impersonated ${targetUser.id} at tenant ${tenant.slug}`);

    return sendSuccess(res, {
      token,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        branch_id: targetUser.branch_id,
        impersonated_by: req.user.id
      }
    }, 'Impersonation started.');
  } catch (err) {
    logger.error('Impersonate error:', err);
    return sendError(res, 'Failed to start impersonation.');
  }
};

/**
 * GET /api/auth/sessions
 * List active sessions/devices for the logged-in tenant user.
 */
const listSessions = async (req, res) => {
  try {
    if (req.user.type !== 'tenant') return sendError(res, 'Sessions currently only supported for tenant users.', 400);

    const tenant = await Tenant.findByPk(req.user.tenantId);
    if (!tenant) return sendBadRequest(res, 'Tenant context missing.');

    const { UserSession } = getTenantModels(getTenantDb(tenant.db_name), tenant.db_name);
    
    const sessions = await UserSession.findAll({
      where: { user_id: req.user.id, is_valid: true },
      order: [['createdAt', 'DESC']],
    });

    return sendSuccess(res, { sessions });
  } catch (err) {
    return sendError(res, 'Failed to fetch sessions.');
  }
};

/**
 * DELETE /api/auth/sessions/:id
 * Revoke a specific session/device.
 */
const revokeSession = async (req, res) => {
  try {
    if (req.user.type !== 'tenant') return sendError(res, 'Only tenant users are supported.', 400);

    const tenant = await Tenant.findByPk(req.user.tenantId);
    const { UserSession } = getTenantModels(getTenantDb(tenant.db_name), tenant.db_name);

    const session = await UserSession.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!session) return sendNotFound(res, 'Session not found.');

    await session.update({ is_valid: false });

    return sendSuccess(res, null, 'Session revoked successfully.');
  } catch (err) {
    return sendError(res, 'Failed to revoke session.');
  }
};

module.exports = { platformLogin, tenantLogin, refreshToken, forgotPassword, verifyOtp, resetPassword, impersonate, listSessions, revokeSession };
