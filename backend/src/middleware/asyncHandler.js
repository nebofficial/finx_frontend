const logger = require('../utils/logger');

/**
 * Express 4: async route handlers must forward rejections with next(err).
 * Wraps (req, res) => Promise handlers so unhandled rejections reach the global error handler.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res)).catch((err) => {
    logger.error('Async route error:', err?.stack || err?.message || err);
    next(err);
  });
};

module.exports = asyncHandler;
