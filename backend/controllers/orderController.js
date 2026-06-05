const db = require('../config/db');
const { successResponse, errorResponse } = require('../helpers/responseHelper');
const { recordStockMovement } = require('../helpers/stockHelper');

const loadOrders = async (userId) => {
  const [orders] = await db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  for (const order of orders) {
    const [items] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    order.items = items;
    order.items_count = items.length;
  }
  return orders;
};

const createOrder = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const itemIds = req.body.item_ids || [];
    if (!Array.isArray(itemIds) || itemIds.length === 0) return errorResponse(res, 'Select at least one cart item.', 422);
    await conn.beginTransaction();
    const placeholders = itemIds.map(() => '?').join(',');
    const [items] = await conn.execute(
      `SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price, p.stock, p.store_id
       FROM carts c JOIN cart_items ci ON ci.cart_id = c.id JOIN products p ON p.id = ci.product_id
       WHERE c.user_id = ? AND ci.id IN (${placeholders}) AND p.status = 'active' AND p.is_deleted = 0 FOR UPDATE`,
      [req.user.id, ...itemIds],
    );
    if (items.length !== itemIds.length) throw Object.assign(new Error('Some cart items are unavailable.'), { statusCode: 409 });
    const insufficient = items.find((item) => Number(item.stock) < Number(item.quantity));
    if (insufficient) throw Object.assign(new Error(`${insufficient.name} is out of stock.`), { statusCode: 409 });

    const byStore = new Map();
    items.forEach((item) => byStore.set(item.store_id, [...(byStore.get(item.store_id) || []), item]));
    const orders = [];
    for (const [storeId, storeItems] of byStore.entries()) {
      const subtotal = storeItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
      const orderNumber = `ORD-${Date.now()}-${storeId}-${Math.floor(Math.random() * 1000)}`;
      const [orderResult] = await conn.execute(
        `INSERT INTO orders (user_id, store_id, order_number, subtotal, total, shipping_address, shipping_city, shipping_province, shipping_postal_code, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, storeId, orderNumber, subtotal, subtotal, req.body.shipping_address, req.body.shipping_city, req.body.shipping_province, req.body.shipping_postal_code, req.body.notes || null],
      );
      for (const item of storeItems) {
        const previousStock = Number(item.stock || 0);
        const newStock = previousStock - Number(item.quantity || 0);
        await conn.execute('UPDATE products SET stock = ? WHERE id = ? AND stock >= ?', [newStock, item.product_id, item.quantity]);
        await recordStockMovement(conn, {
          productId: item.product_id,
          userId: req.user.id,
          movementType: 'OUT',
          quantity: Number(item.quantity || 0),
          previousStock,
          newStock,
          reason: `Order ${orderNumber}`,
        });
        await conn.execute('INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)', [orderResult.insertId, item.product_id, item.name, item.price, item.quantity, Number(item.price) * Number(item.quantity)]);
      }
      orders.push({ id: orderResult.insertId, order_number: orderNumber });
    }
    await conn.execute(`DELETE FROM cart_items WHERE id IN (${placeholders})`, itemIds);
    await conn.commit();
    return successResponse(res, { orders }, 'Order created successfully.', 201);
  } catch (error) {
    await conn.rollback();
    return errorResponse(res, error.message || 'Unable to create order.', error.statusCode || 500);
  } finally { conn.release(); }
};

const listOrders = async (req, res, next) => {
  try { return successResponse(res, { orders: await loadOrders(req.user.id) }, 'Orders retrieved successfully.'); }
  catch (error) { return next(error); }
};

const confirmReceipt = async (req, res, next) => {
  try {
    await db.execute('UPDATE orders SET status = \'delivered\' WHERE id = ? AND user_id = ? AND status = \'shipped\'', [req.params.orderId, req.user.id]);
    return successResponse(res, null, 'Receipt confirmed successfully.');
  } catch (error) { return next(error); }
};

module.exports = { createOrder, listOrders, confirmReceipt };
