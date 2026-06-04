const db = require('../config/db');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

const listNotifications = async (req, res, next) => {
  try {
    const [notifications] = await db.execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id],
    );
    const unreadCount = notifications.filter((notification) => !notification.is_read).length;
    return successResponse(res, { notifications, unreadCount, unread_count: unreadCount }, 'Notifications retrieved successfully.');
  } catch (error) { return next(error); }
};

const markAsRead = async (req, res, next) => {
  try {
    const [result] = await db.execute('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [req.params.notificationId, req.user.id]);
    if (result.affectedRows === 0) return errorResponse(res, 'Notification not found.', 404);
    return successResponse(res, null, 'Notification marked as read.');
  } catch (error) { return next(error); }
};

module.exports = { listNotifications, markAsRead };
