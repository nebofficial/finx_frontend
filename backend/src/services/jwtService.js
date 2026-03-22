const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

/**
 * Generate a JWT for a PLATFORM user (SystemAdmin / Support).
 */
const signPlatformToken = (user) => {
  const jti = uuidv4();
  const token = jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      role: user.role,
      tenant_id: null,
      type: 'platform',
      jti,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
  return { token, jti };
};

/**
 * Generate a JWT for a TENANT user (SuperAdmin / Admin / BranchAdmin / FieldCollector).
 */
const signTenantToken = (user, tenantId) => {
  const jti = uuidv4();
  const token = jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      role: user.role,
      tenant_id: tenantId,
      type: 'tenant',
      jti,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
  return { token, jti };
};

/**
 * Generate a refresh token.
 */
const signRefreshToken = (userId, type = 'tenant') => {
  const jti = uuidv4();
  const token = jwt.sign(
    { user_id: userId, type, jti },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
  return { token, jti };
};

/**
 * Verify a refresh token.
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};

module.exports = {
  signPlatformToken,
  signTenantToken,
  signRefreshToken,
  verifyRefreshToken,
};
