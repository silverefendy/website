const db = require('../config/db');
const productRepository = require('../repositories/productRepository');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

const resolveStoreId = async (req) => {
  if (req.user.store_id) return req.user.store_id;
  const [stores] = await db.execute('SELECT id FROM stores WHERE user_id = ? AND is_active = TRUE LIMIT 1', [req.user.id]);
  return stores[0]?.id;
};

const dashboard = async (req, res, next) => {
  try {
    const storeId = await resolveStoreId(req);
    if (!storeId) return errorResponse(res, 'Seller store not found.', 404);

    const [[productStats]] = await db.execute('SELECT COUNT(*) AS total_products, SUM(stock <= 5 AND status = \'active\') AS low_stock_products FROM products WHERE store_id = ? AND is_deleted = 0', [storeId]);
    const [[orderStats]] = await db.execute('SELECT COUNT(*) AS total_orders, SUM(status = \'pending\') AS pending_orders, COALESCE(SUM(total), 0) AS total_sales, COALESCE(SUM(total), 0) AS total_revenue FROM orders WHERE store_id = ?', [storeId]);
    const [monthlySales] = await db.execute(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COALESCE(SUM(total), 0) AS sales, COUNT(*) AS orders
       FROM orders WHERE store_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m') ORDER BY month ASC`,
      [storeId],
    );
    const [topProducts] = await db.execute(
      `SELECT oi.product_id, oi.product_name AS name, SUM(oi.quantity) AS quantity_sold, SUM(oi.subtotal) AS sales
       FROM order_items oi JOIN orders o ON o.id = oi.order_id
       WHERE o.store_id = ? GROUP BY oi.product_id, oi.product_name ORDER BY quantity_sold DESC LIMIT 5`,
      [storeId],
    );
    const [recentOrders] = await db.execute(
      `SELECT o.*, u.name AS customer_name FROM orders o LEFT JOIN users u ON u.id = o.user_id
       WHERE o.store_id = ? ORDER BY o.created_at DESC LIMIT 10`,
      [storeId],
    );
    return successResponse(res, {
      stats: { ...productStats, ...orderStats },
      monthly_sales: monthlySales,
      top_selling_products: topProducts,
      recent_orders: recentOrders,
    }, 'Seller analytics retrieved successfully.');
  } catch (error) { return next(error); }
};

const products = async (req, res, next) => {
  try {
    const storeId = await resolveStoreId(req);
    if (!storeId) return errorResponse(res, 'Seller store not found.', 404);
    return successResponse(res, { products: await productRepository.listSellerProducts(storeId) }, 'Seller products retrieved successfully.');
  } catch (error) { return next(error); }
};

const orders = async (req, res, next) => {
  try {
    const storeId = await resolveStoreId(req);
    if (!storeId) return errorResponse(res, 'Seller store not found.', 404);
    const params = [storeId];
    const statusSql = req.query.status ? 'AND o.status = ?' : '';
    if (req.query.status) params.push(req.query.status);
    const [rows] = await db.execute(
      `SELECT o.*, u.name AS customer_name, u.name AS user_name, u.email AS customer_email
       FROM orders o LEFT JOIN users u ON u.id = o.user_id
       WHERE o.store_id = ? ${statusSql} ORDER BY o.created_at DESC LIMIT 200`,
      params,
    );
    for (const order of rows) {
      const [items] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
      order.items_count = items.length;
    }
    return successResponse(res, { orders: rows }, 'Seller orders retrieved successfully.');
  } catch (error) { return next(error); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const storeId = await resolveStoreId(req);
    if (!storeId) return errorResponse(res, 'Seller store not found.', 404);
    const [result] = await db.execute('UPDATE orders SET status = ? WHERE id = ? AND store_id = ?', [req.body.status, req.params.orderId, storeId]);
    if (result.affectedRows === 0) return errorResponse(res, 'Order not found.', 404);
    return successResponse(res, null, 'Order status updated successfully.');
  } catch (error) { return next(error); }
};

module.exports = { dashboard, products, orders, updateOrderStatus };
