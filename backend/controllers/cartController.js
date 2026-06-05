const db = require('../config/db');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

const getOrCreateCartId = async (userId) => {
  const [existing] = await db.execute('SELECT id FROM carts WHERE user_id = ? LIMIT 1', [userId]);
  if (existing[0]) return existing[0].id;
  const [result] = await db.execute('INSERT INTO carts (user_id) VALUES (?)', [userId]);
  return result.insertId;
};

const loadItems = async (userId) => {
  const [items] = await db.execute(
    `SELECT ci.id, ci.product_id, ci.quantity, p.name, p.slug, p.price, p.stock,
       (SELECT image_path FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC, id ASC LIMIT 1) AS primary_image
     FROM carts c JOIN cart_items ci ON ci.cart_id = c.id JOIN products p ON p.id = ci.product_id
     WHERE c.user_id = ? AND p.status = 'active' AND p.is_deleted = 0 ORDER BY ci.updated_at DESC`,
    [userId],
  );
  return items;
};

const getCart = async (req, res, next) => {
  try { return successResponse(res, { items: await loadItems(req.user.id) }, 'Cart retrieved successfully.'); }
  catch (error) { return next(error); }
};

const addItem = async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity || 1);
    if (!Number.isInteger(quantity) || quantity < 1) return errorResponse(res, 'Quantity must be positive.', 422);
    const [products] = await db.execute('SELECT id, stock FROM products WHERE id = ? AND status = \'active\' AND is_deleted = 0 LIMIT 1', [req.body.product_id]);
    const product = products[0];
    if (!product) return errorResponse(res, 'Product not found.', 404);
    if (product.stock < quantity) return errorResponse(res, 'Not enough stock available.', 409);
    const cartId = await getOrCreateCartId(req.user.id);
    await db.execute(
      `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = LEAST(quantity + VALUES(quantity), ?), updated_at = CURRENT_TIMESTAMP`,
      [cartId, product.id, quantity, product.stock],
    );
    return successResponse(res, { items: await loadItems(req.user.id) }, 'Product added to cart.');
  } catch (error) { return next(error); }
};

const updateItem = async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) return errorResponse(res, 'Quantity must be positive.', 422);
    const [rows] = await db.execute(
      `SELECT ci.id, p.stock FROM carts c JOIN cart_items ci ON ci.cart_id = c.id JOIN products p ON p.id = ci.product_id WHERE c.user_id = ? AND ci.id = ? AND p.status = 'active' AND p.is_deleted = 0 LIMIT 1`,
      [req.user.id, req.params.itemId],
    );
    if (!rows.length) return errorResponse(res, 'Cart item not found.', 404);
    if (rows[0].stock < quantity) return errorResponse(res, 'Not enough stock available.', 409);
    await db.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, req.params.itemId]);
    return successResponse(res, { items: await loadItems(req.user.id) }, 'Cart updated.');
  } catch (error) { return next(error); }
};

const removeItem = async (req, res, next) => {
  try {
    await db.execute('DELETE ci FROM cart_items ci JOIN carts c ON c.id = ci.cart_id WHERE c.user_id = ? AND ci.id = ?', [req.user.id, req.params.itemId]);
    return successResponse(res, { items: await loadItems(req.user.id) }, 'Item removed.');
  } catch (error) { return next(error); }
};

const clearCart = async (req, res, next) => {
  try {
    await db.execute('DELETE ci FROM cart_items ci JOIN carts c ON c.id = ci.cart_id WHERE c.user_id = ?', [req.user.id]);
    return successResponse(res, { items: [] }, 'Cart cleared.');
  } catch (error) { return next(error); }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
