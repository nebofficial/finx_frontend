const express = require('express');
const { param } = require('express-validator');
const router = express.Router();
const planCtrl = require('./plan.controller');
const subCtrl = require('./subscription.controller');
const invCtrl = require('./invoice.controller');
const analyticsCtrl = require('./analytics.controller');
const { authMiddleware, platformOnly } = require('../../../middleware/authMiddleware');
const { requireRole } = require('../../../middleware/rbacMiddleware');
const asyncHandler = require('../../../middleware/asyncHandler');
const validate = require('../../../middleware/validate');

router.use(authMiddleware, platformOnly, requireRole('SystemAdmin', 'Support'));

// Plans
router.get('/plans', planCtrl.listPlans);
router.post('/plans', requireRole('SystemAdmin', 'Support'), planCtrl.createPlan);
router.put('/plans/:id', requireRole('SystemAdmin', 'Support'), planCtrl.updatePlan);
router.delete('/plans/:id', requireRole('SystemAdmin', 'Support'), planCtrl.deletePlan);

// Subscriptions
router.get('/subscriptions', subCtrl.listSubscriptions);
router.post('/subscriptions/assign', requireRole('SystemAdmin', 'Support'), subCtrl.assignPlan);
router.put('/subscriptions/:id', requireRole('SystemAdmin', 'Support'), subCtrl.updateSubscription);

// Invoices & payments
router.get('/invoices', invCtrl.listInvoices);
router.get('/invoices/summary', invCtrl.invoiceSummary);
router.post('/invoices', requireRole('SystemAdmin', 'Support'), invCtrl.createInvoice);
router.put('/invoices/:id/status', requireRole('SystemAdmin', 'Support'), invCtrl.updateInvoiceStatus);
// Send invoice email (async — wrapped so rejections become proper JSON errors, not blank 500s)
router.post(
  '/invoices/:id/send',
  [param('id').isUUID()],
  validate,
  asyncHandler(invCtrl.sendInvoice)
);
router.post('/payments', requireRole('SystemAdmin', 'Support'), invCtrl.recordPayment);

// Analytics
router.get('/analytics', analyticsCtrl.platformAnalytics);

module.exports = router;
