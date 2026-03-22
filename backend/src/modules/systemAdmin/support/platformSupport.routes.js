const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { body, param } = require('express-validator');
const router = express.Router();
const config = require('../../../config');
const ctrl = require('./platformSupport.controller');
const validate = require('../../../middleware/validate');
const { authMiddleware, platformOnly } = require('../../../middleware/authMiddleware');
const { requireRole } = require('../../../middleware/rbacMiddleware');

const uploadDir = path.join(__dirname, '..', '..', '..', '..', config.upload.dir, 'support');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: (config.upload.maxFileSizeMB || 10) * 1024 * 1024 },
});

router.use(authMiddleware, platformOnly, requireRole('SystemAdmin', 'Support'));

router.get('/tickets/stats', ctrl.ticketStats);
router.get('/tenant-users', ctrl.listTenantUsers);
router.get('/agents', ctrl.listAgents);
router.get('/tickets', ctrl.listTickets);
router.post(
  '/tickets',
  [
    body('tenant_id').isUUID(),
    body('subject').notEmpty(),
    body('description').notEmpty(),
    body('raised_by_tenant_user_id').isUUID(),
    body('category').optional().isIn(['technical', 'billing', 'operational', 'other']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  ],
  validate,
  ctrl.createTicket
);
router.get('/tickets/:id', [param('id').isUUID()], validate, ctrl.getTicket);
router.post(
  '/tickets/:id/reply',
  upload.array('files', 8),
  [param('id').isUUID(), body('message').notEmpty()],
  validate,
  ctrl.addReply
);
router.patch(
  '/tickets/:id/status',
  [
    param('id').isUUID(),
    body('status').isIn(['open', 'in_progress', 'waiting_for_user', 'resolved', 'closed', 'reopened']),
    body('resolution_notes').optional(),
  ],
  validate,
  ctrl.patchStatus
);
router.patch(
  '/tickets/:id/assign',
  [param('id').isUUID()],
  validate,
  ctrl.patchAssign
);
router.patch(
  '/tickets/:id/replies/:replyId',
  [
    param('id').isUUID(),
    param('replyId').isUUID(),
    body('message').notEmpty(),
  ],
  validate,
  ctrl.patchReply
);
router.delete(
  '/tickets/:id/replies/:replyId',
  requireRole('SystemAdmin'),
  [param('id').isUUID(), param('replyId').isUUID()],
  validate,
  ctrl.deleteReply
);

module.exports = router;
