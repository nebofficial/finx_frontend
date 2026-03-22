const bcrypt = require('bcryptjs');
const config = require('../config');

/**
 * Hash a plain-text password.
 */
const hashPassword = async (password) => {
  return bcrypt.hash(password, config.bcryptRounds);
};

/**
 * Compare a plain-text password with a stored hash.
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a random alphanumeric token (for API keys, invite links, etc.)
 */
const generateToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

/**
 * Build a safe tenant database name from a tenant ID.
 * e.g. "coop_101_db"
 */
const buildTenantDbName = (tenantId) => {
  const safe = tenantId.replace(/-/g, '').substring(0, 20);
  return `coop_${safe}_db`;
};

/**
 * Paginate helper — extract page/limit from req.query
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 20);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Format pagination meta
 */
const paginateMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  buildTenantDbName,
  getPagination,
  paginateMeta,
};
