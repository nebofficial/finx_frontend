const AuditLog = require('../models/main/AuditLog');
const logger = require('../utils/logger');

/**
 * Audit Logger Middleware.
 *
 * Async, non-blocking — fires AFTER the response is sent.
 * Captures: actor, role, tenant, action, resource, IP.
 *
 * Usage:
 *   router.post('/members', authMiddleware, tenantResolver, auditLogger('CREATE_MEMBER', 'Member'), controller)
 *
 * @param {string} action - Action label e.g. 'CREATE_MEMBER', 'APPROVE_LOAN'
 * @param {string} resource - Resource type e.g. 'Member', 'LoanAccount'
 */
const auditLogger = (action, resource = null) => {
  return (req, res, next) => {
    // Capture the original end function
    const originalEnd = res.end.bind(res);

    res.end = function (chunk, encoding) {
      // Restore original
      res.end = originalEnd;
      res.end(chunk, encoding);

      // Async write — does not block the response
      setImmediate(async () => {
        try {
          const status = res.statusCode < 400 ? 'success' : 'failure';

          await AuditLog.create({
            actor_id: req.user?.id || null,
            actor_email: req.user?.email || null,
            actor_role: req.user?.role || null,
            tenant_id: req.user?.tenantId || null,
            action,
            resource,
            resource_id: res.locals.resourceId || null,
            old_value: res.locals.oldValue || null,
            new_value: res.locals.newValue || null,
            ip_address: req.ip || req.connection?.remoteAddress,
            user_agent: req.headers['user-agent'],
            status,
            metadata: {
              method: req.method,
              path: req.path,
              statusCode: res.statusCode,
            },
          });
        } catch (err) {
          // Audit failure should never crash the app
          logger.error('Audit log write failed:', err.message);
        }
      });
    };

    next();
  };
};

module.exports = auditLogger;
