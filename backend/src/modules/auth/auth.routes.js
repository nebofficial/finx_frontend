const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { platformLogin, tenantLogin, refreshToken, forgotPassword, verifyOtp, resetPassword, impersonate, listSessions, revokeSession } = require('./auth.controller');
const validate = require('../../middleware/validate');
const { authMiddleware } = require('../../middleware/authMiddleware');

// Platform login (SystemAdmin / Support)
router.post(
  '/platform/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  platformLogin
);

// Tenant login (SuperAdmin / Admin / BranchAdmin / FieldCollector)
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    body('tenant_slug').notEmpty().withMessage('Organization identifier (tenant_slug) is required'),
  ],
  validate,
  tenantLogin
);

// Refresh token
router.post(
  '/refresh',
  [
    body('refresh_token').notEmpty(),
  ],
  validate,
  refreshToken
);

// ── Password Reset Flow ──

// Request OTP
router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail(),
    body('tenant_slug').notEmpty().withMessage('Organization identifier is required'),
  ],
  validate,
  forgotPassword
);

// Verify OTP
router.post(
  '/verify-otp',
  [
    body('email').isEmail().normalizeEmail(),
    body('tenant_slug').notEmpty(),
    body('otp').isLength({ min: 6, max: 6 }),
  ],
  validate,
  verifyOtp
);

// Reset Password (requires the temporary reset_token from verify-otp)
router.post(
  '/reset-password',
  authMiddleware,
  [
    body('new_password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ],
  validate,
  resetPassword
);

// Impersonate user (SuperAdmin only)
router.post(
  '/impersonate',
  authMiddleware,
  [
    body('user_id').isUUID().withMessage('user_id must be a valid UUID'),
  ],
  validate,
  impersonate
);

// ── Session Management ──

router.get('/sessions', authMiddleware, listSessions);
router.delete('/sessions/:id', authMiddleware, revokeSession);

module.exports = router;
