const db = require('../config/db');
const { successResponse, errorResponse } = require('../helpers/responseHelper');
const { slugify, normalizeNullableText } = require('../helpers/stringHelper');
const { buildPublicUploadPath } = require('../helpers/uploadHelper');

const toInt = (value, fallback = 1, min = 1, max = 100) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
};

const buildUploadPath = buildPublicUploadPath;

const dashboard = async (req, res, next) => {
  try {
    const [[userStats]] = await db.execute('SELECT COUNT(*) AS total_users FROM users');
    const [[productStats]] = await db.execute('SELECT COUNT(*) AS total_products FROM products WHERE status <> \'deleted\'');
    const [[orderStats]] = await db.execute('SELECT COUNT(*) AS total_orders, SUM(status = \'pending\') AS pending_orders, COALESCE(SUM(total), 0) AS total_sales FROM orders');
    const [ordersPerDay] = await db.execute(
      `SELECT DATE(created_at) AS date, COUNT(*) AS orders
       FROM orders WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
       GROUP BY DATE(created_at) ORDER BY date ASC`,
    );
    const [ordersByStatus] = await db.execute('SELECT status, COUNT(*) AS count FROM orders GROUP BY status ORDER BY status ASC');
    const [recentOrders] = await db.execute(
      `SELECT o.*, s.store_name, u.name AS customer_name
       FROM orders o LEFT JOIN stores s ON s.id = o.store_id LEFT JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC LIMIT 10`,
    );

    return successResponse(res, {
      stats: { ...userStats, ...productStats, ...orderStats },
      orders_per_day: ordersPerDay,
      orders_by_status: ordersByStatus,
      recent_orders: recentOrders,
    }, 'Admin statistics retrieved successfully.');
  } catch (error) { return next(error); }
};

const listUsers = async (req, res, next) => {
  try {
    const page = toInt(req.query.page, 1, 1, 100000);
    const limit = toInt(req.query.limit, 20, 1, 100);
    const offset = (page - 1) * limit;
    const where = [];
    const params = [];

    if (req.query.search) {
      where.push('(u.name LIKE ? OR u.email LIKE ?)');
      const term = `%${req.query.search}%`;
      params.push(term, term);
    }
    if (req.query.role) {
      where.push('r.name = ?');
      params.push(req.query.role);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [[countRow]] = await db.execute(`SELECT COUNT(*) AS total FROM users u JOIN roles r ON r.id = u.role_id ${whereSql}`, params);
    const [users] = await db.execute(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.role_id, r.name AS role, u.is_active, u.created_at, u.updated_at
       FROM users u JOIN roles r ON r.id = u.role_id ${whereSql}
       ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );
    const total = Number(countRow.total || 0);
    return successResponse(res, { users, pagination: { page, currentPage: page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) } }, 'Users retrieved successfully.');
  } catch (error) { return next(error); }
};

const updateUser = async (req, res, next) => {
  try {
    const fields = {};
    ['name', 'phone'].forEach((field) => {
      if (req.body[field] !== undefined) fields[field] = normalizeNullableText(req.body[field]);
    });
    if (req.body.is_active !== undefined) fields.is_active = Boolean(req.body.is_active);
    if (req.body.role_id !== undefined) fields.role_id = Number(req.body.role_id);

    const keys = Object.keys(fields);
    if (keys.length === 0) return errorResponse(res, 'No user fields were provided.', 400);
    await db.execute(`UPDATE users SET ${keys.map((key) => `${key} = ?`).join(', ')} WHERE id = ?`, [...Object.values(fields), req.params.userId]);
    return successResponse(res, null, 'User updated successfully.');
  } catch (error) { return next(error); }
};

const listOrders = async (req, res, next) => {
  try {
    const where = [];
    const params = [];
    if (req.query.status) { where.push('o.status = ?'); params.push(req.query.status); }
    if (req.query.date_from) { where.push('DATE(o.created_at) >= ?'); params.push(req.query.date_from); }
    if (req.query.date_to) { where.push('DATE(o.created_at) <= ?'); params.push(req.query.date_to); }
    if (req.query.store) { where.push('s.store_name LIKE ?'); params.push(`%${req.query.store}%`); }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [orders] = await db.execute(
      `SELECT o.*, s.store_name, u.name AS customer_name, u.email AS customer_email
       FROM orders o LEFT JOIN stores s ON s.id = o.store_id LEFT JOIN users u ON u.id = o.user_id
       ${whereSql} ORDER BY o.created_at DESC LIMIT 200`,
      params,
    );
    for (const order of orders) {
      const [items] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
      order.items_count = items.length;
    }
    return successResponse(res, { orders }, 'Orders retrieved successfully.');
  } catch (error) { return next(error); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const [result] = await db.execute('UPDATE orders SET status = ? WHERE id = ?', [req.body.status, req.params.orderId]);
    if (result.affectedRows === 0) return errorResponse(res, 'Order not found.', 404);
    return successResponse(res, null, 'Order status updated successfully.');
  } catch (error) { return next(error); }
};

const createCategory = async (req, res, next) => {
  try {
    const image = buildUploadPath(req.file);
    const categorySlug = req.body.slug || slugify(req.body.name);
    const [result] = await db.execute(
      'INSERT INTO categories (name, slug, description, image, parent_id) VALUES (?, ?, ?, ?, ?)',
      [req.body.name, categorySlug, normalizeNullableText(req.body.description), image || null, req.body.parent_id || null],
    );
    return successResponse(res, { id: result.insertId }, 'Category created successfully.', 201);
  } catch (error) { return next(error); }
};

const updateCategory = async (req, res, next) => {
  try {
    const fields = { ...req.body };
    if (fields.name && !fields.slug) fields.slug = slugify(fields.name);
    if (fields.description !== undefined) fields.description = normalizeNullableText(fields.description);
    if (fields.parent_id === '') fields.parent_id = null;
    const image = buildUploadPath(req.file);
    if (image) fields.image = image;
    const keys = Object.keys(fields);
    if (keys.length === 0) return errorResponse(res, 'No category fields were provided.', 400);
    const [result] = await db.execute(`UPDATE categories SET ${keys.map((key) => `${key} = ?`).join(', ')} WHERE id = ?`, [...Object.values(fields), req.params.categoryId]);
    if (result.affectedRows === 0) return errorResponse(res, 'Category not found.', 404);
    return successResponse(res, null, 'Category updated successfully.');
  } catch (error) { return next(error); }
};

const deleteCategory = async (req, res, next) => {
  try {
    const [children] = await db.execute('SELECT id FROM categories WHERE parent_id = ? LIMIT 1', [req.params.categoryId]);
    if (children.length) return errorResponse(res, 'Category has child categories.', 409);
    const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [req.params.categoryId]);
    if (result.affectedRows === 0) return errorResponse(res, 'Category not found.', 404);
    return successResponse(res, null, 'Category deleted successfully.');
  } catch (error) { return next(error); }
};

const listSettings = async (req, res, next) => {
  try {
    const [settings] = await db.execute('SELECT setting_key, setting_value, description FROM site_settings ORDER BY setting_key ASC');
    return successResponse(res, { settings }, 'Settings retrieved successfully.');
  } catch (error) { return next(error); }
};

const updateSetting = async (req, res, next) => {
  try {
    await db.execute(
      `INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP`,
      [req.params.settingKey, req.body.setting_value],
    );
    return successResponse(res, null, 'Setting updated successfully.');
  } catch (error) { return next(error); }
};

module.exports = {
  dashboard,
  listUsers,
  updateUser,
  listOrders,
  updateOrderStatus,
  createCategory,
  updateCategory,
  deleteCategory,
  listSettings,
  updateSetting,
};
