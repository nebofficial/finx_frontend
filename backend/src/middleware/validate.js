const { validationResult } = require('express-validator');
const { sendBadRequest } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Runs express-validator checks and returns 400 if any fail.
 * Should be placed AFTER your validation chains, BEFORE the controller.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Log what failed so we can fix frontend payloads (keep secrets redacted).
    const body = { ...(req.body || {}) };
    if (body.super_admin_password) body.super_admin_password = '[REDACTED]';

    logger.warn('Validation failed', {
      method: req.method,
      url: req.originalUrl,
      errors: errors.array(),
      body,
    });

    return sendBadRequest(res, 'Validation failed', errors.array());
  }
  next();
};

module.exports = validate;
