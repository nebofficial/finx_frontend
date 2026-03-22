const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('./notification.controller');
const validate = require('../../middleware/validate');
const { authMiddleware } = require('../../middleware/authMiddleware');
const tenantResolver = require('../../middleware/tenantResolver');
const { requireRole } = require('../../middleware/rbacMiddleware');
const subscriptionGuard = require('../../middleware/subscriptionGuard');
const auditLogger = require('../../middleware/auditLogger');

router.use(authMiddleware, tenantResolver);

router.get('/', requireRole('SuperAdmin', 'Admin', 'BranchAdmin'), ctrl.listNotifications);

router.post('/send',
  requireRole('SuperAdmin', 'Admin'),
  subscriptionGuard('sms'), // Assuming bulk notifications are a premium feature
  [
    body('target_type').isIn(['all', 'branch', 'individual']),
    body('channel').isIn(['email', 'sms', 'in-app']),
    body('type').isIn(['marketing', 'alert', 'reminder', 'system']),
    body('title').notEmpty(),
    body('message').notEmpty(),
  ],
  validate,
  auditLogger('SEND_NOTIFICATION', 'Notification'),
  ctrl.sendNotification
);

module.exports = router;
