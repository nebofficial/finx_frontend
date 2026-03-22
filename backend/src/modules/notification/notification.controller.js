const { sendSuccess, sendCreated, sendError, sendNotFound } = require('../../utils/response');
const { getPagination, paginateMeta } = require('../../utils/helpers');

/**
 * Notification Controller
 * Send targeted or broadcast SMS/Email messages to members.
 */

const listNotifications = async (req, res) => {
  try {
    const { Notification } = req.db;
    const { page, limit, offset } = getPagination(req.query);

    const { count, rows } = await Notification.findAndCountAll({
      limit, offset,
      order: [['createdAt', 'DESC']],
    });

    return sendSuccess(res, { notifications: rows, meta: paginateMeta(count, page, limit) });
  } catch (err) {
    return sendError(res, 'Failed to fetch notifications.');
  }
};

const sendNotification = async (req, res) => {
  try {
    const { Notification, Member } = req.db;
    const { target_type, channel, type, target_id, title, message } = req.body;

    let targetIds = [];
    if (target_type === 'individual') {
      if (!target_id) return sendError(res, 'target_id is required for individual notifications.', 400);
      const member = await Member.findByPk(target_id);
      if (!member) return sendNotFound(res, 'Member not found.');
      targetIds = [member.id];
    } else if (target_type === 'branch') {
      if (!target_id) return sendError(res, 'target_id (branch_id) is required for branch notifications.', 400);
      const members = await Member.findAll({ where: { branch_id: target_id }, attributes: ['id'] });
      targetIds = members.map(m => m.id);
    } else if (target_type === 'all') {
      const members = await Member.findAll({ attributes: ['id'] });
      targetIds = members.map(m => m.id);
    }

    if (targetIds.length === 0) {
      return sendError(res, 'No target members found to send notification.', 400);
    }

    const notifications = targetIds.map(id => ({
      type,
      channel,
      target_type,
      target_id: id,
      title,
      message,
      sent_by: req.user.id,
      status: 'pending', // A background job would ideally process these
    }));

    const created = await Notification.bulkCreate(notifications);

    // Mock direct sending for MVP (In reality, dispatch to a Queue)
    await Notification.update({ status: 'sent', sent_at: new Date() }, {
      where: { id: created.map(n => n.id) }
    });

    return sendCreated(res, { sent_count: created.length }, 'Notifications scheduled/sent successfully.');
  } catch (err) {
    return sendError(res, 'Failed to send notification. ' + err.message);
  }
};

module.exports = { listNotifications, sendNotification };
