const db = require('../config/db');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

const listWishlist = async (req, res, next) => {
  try {
    const [items] = await db.execute(
      `SELECT w.id AS wishlist_id, p.*, c.name AS category_name, s.store_name,
        (SELECT image_path FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC, id ASC LIMIT 1) AS primary_image,
        COALESCE((SELECT ROUND(AVG(rating), 1) FROM product_reviews WHERE product_id = p.id), 0) AS average_rating,
        (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id) AS review_count
       FROM wishlists w
       JOIN products p ON p.id = w.product_id
       LEFT JOIN categories c ON c.id = p.category_id
       JOIN stores s ON s.id = p.store_id
       WHERE w.user_id = ? AND p.status = 'active' AND p.is_deleted = FALSE
       ORDER BY w.created_at DESC`,
      [req.user.id],
    );
    return successResponse(res, { items, products: items }, 'Wishlist retrieved successfully.');
  } catch (error) { return next(error); }
};

const addWishlist = async (req, res, next) => {
  try {
    const [products] = await db.execute("SELECT id FROM products WHERE id = ? AND status = 'active' AND is_deleted = FALSE LIMIT 1", [req.params.productId]);
    if (!products.length) return errorResponse(res, 'Product not found.', 404);
    await db.execute('INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)', [req.user.id, req.params.productId]);
    return successResponse(res, null, 'Product added to wishlist.');
  } catch (error) { return next(error); }
};

const removeWishlist = async (req, res, next) => {
  try {
    await db.execute('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
    return successResponse(res, null, 'Product removed from wishlist.');
  } catch (error) { return next(error); }
};

module.exports = { listWishlist, addWishlist, removeWishlist };
