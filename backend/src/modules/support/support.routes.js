const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { body, param } = require('express-validator');
const ctrl = require('./support.controller');
const validate = require('../../middleware/validate');
const { authMiddleware } = require('../../middleware/authMiddleware');
const tenantResolver = require('../../middleware/tenantResolver');
const { requireRole } = require('../../middleware/rbacMiddleware');
const auditLogger = require('../../middleware/auditLogger');
const config = require('../../config');

const uploadDir = path.join(__dirname, '..', '..', '..', config.upload.dir, 'support');
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

router.use(authMiddleware, tenantResolver);

router.get('/', ctrl.listTickets);
router.post(
  '/',
  [
    body('subject').notEmpty(),
    body('description').notEmpty(),
    body('category').isIn(['technical', 'billing', 'operational', 'other']),
    body('priority').isIn(['low', 'medium', 'high', 'critical']),
  ],
  validate,
  auditLogger('CREATE_TICKET', 'SupportTicket'),
  ctrl.createTicket
);

router.get('/:id', [param('id').isUUID()], validate, ctrl.getTicket);

router.patch(
  '/:id/status',
  [
    param('id').isUUID(),
    body('status').isIn(['open', 'in_progress', 'waiting_for_user', 'resolved', 'closed', 'reopened']),
  ],
  validate,
  ctrl.patchStatus
);

router.post(
  '/:id/reply',
  upload.array('files', 8),
  [param('id').isUUID(), body('message').notEmpty()],
  validate,
  ctrl.addReply
);

router.patch(
  '/:id/resolve',
  requireRole('SuperAdmin', 'Admin'),
  [
    param('id').isUUID(),
    body('resolution_notes').notEmpty(),
  ],
  validate,
  auditLogger('RESOLVE_TICKET', 'SupportTicket'),
  ctrl.resolveTicket
);

module.exports = router;
