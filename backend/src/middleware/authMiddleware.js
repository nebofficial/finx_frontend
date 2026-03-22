const jwt = require('jsonwebtoken');
const config = require('../config');
const { sendUnauthorized } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Verify JWT and attach decoded user info to req.user.
 * Supports both platform tokens (SystemAdmin) and tenant tokens.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendUnauthorized(res, 'Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    // decoded shape: { user_id, email, role, tenant_id, type: 'platform' | 'tenant' }
    req.user = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
      tenantId: decoded.tenant_id || null,
      type: decoded.type || 'tenant', // 'platform' for SystemAdmin/Support
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendUnauthorized(res, 'Token has expired. Please log in again.');
    }
    if (err.name === 'JsonWebTokenError') {
      return sendUnauthorized(res, 'Invalid token.');
    }
    logger.error('Auth middleware error:', err);
    return sendUnauthorized(res, 'Authentication failed.');
  }
};

/**
 * Middleware to restrict access to platform-level users only (SystemAdmin, Support).
 */
const platformOnly = (req, res, next) => {
  if (req.user.type !== 'platform') {
    return sendUnauthorized(res, 'Access restricted to platform administrators.');
  }
  next();
};

module.exports = { authMiddleware, platformOnly };
