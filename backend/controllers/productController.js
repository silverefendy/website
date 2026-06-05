const db = require('../config/db');
const productRepository = require('../repositories/productRepository');
const { successResponse, errorResponse } = require('../helpers/responseHelper');
const { slugify } = require('../helpers/stringHelper');
const { buildPublicUploadPath } = require('../helpers/uploadHelper');
const { recordStockMovement } = require('../helpers/stockHelper');

const listProducts = async (req, res, next) => {
  try {
    const data = await productRepository.list(req.query);
    return successResponse(res, data, 'Products retrieved successfully.');
  } catch (error) {
    return next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await productRepository.findDetailBySlug(req.params.slug, req.user?.id);
    if (!product) return errorResponse(res, 'Product not found.', 404);
    return successResponse(res, { product }, 'Product retrieved successfully.');
  } catch (error) {
    return next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || '').trim();
    const product = await productRepository.findDetailBySlug(req.params.slug, req.user.id);
    if (!product) return errorResponse(res, 'Product not found.', 404);
    await productRepository.upsertReview({ productId: product.id, userId: req.user.id, rating, comment });
    return successResponse(res, null, 'Review submitted successfully.', 201);
  } catch (error) {
    return next(error);
  }
};

const buildUploadPath = buildPublicUploadPath;

const resolveSellerStoreId = async (req) => {
  if (req.user.store_id) return req.user.store_id;
  const [stores] = await db.execute('SELECT id FROM stores WHERE user_id = ? AND is_active = TRUE LIMIT 1', [req.user.id]);
  return stores[0]?.id;
};

const getProductById = async (req, res, next) => {
  try {
    const storeId = await resolveSellerStoreId(req);
    const product = await productRepository.findById(req.params.id);
    if (!product || product.store_id !== storeId) return errorResponse(res, 'Product not found.', 404);
    const [images] = await db.execute('SELECT id, image_path, is_primary, sort_order FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC, id ASC', [product.id]);
    product.images = images;
    return successResponse(res, { product }, 'Product retrieved successfully.');
  } catch (error) { return next(error); }
};

const createProduct = async (req, res, next) => {
  let conn;
  try {
    const storeId = await resolveSellerStoreId(req);
    if (!storeId) return errorResponse(res, 'Seller store not found.', 404);
    conn = await db.getConnection();
    const productSlug = req.body.slug || slugify(req.body.name);
    await conn.beginTransaction();
    const [result] = await conn.execute(
      `INSERT INTO products (store_id, category_id, name, slug, description, price, stock, weight, weight_unit, \`condition\`, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [storeId, req.body.category_id, req.body.name, productSlug, req.body.description, req.body.price, req.body.stock || 0, req.body.weight, req.body.weight_unit || 'g', req.body.condition, req.body.status],
    );
    if (Number(req.body.stock || 0) > 0) {
      await recordStockMovement(conn, {
        productId: result.insertId,
        userId: req.user.id,
        movementType: 'IN',
        quantity: Number(req.body.stock || 0),
        previousStock: 0,
        newStock: Number(req.body.stock || 0),
        reason: 'Initial product stock',
      });
    }
    const primaryIndex = Number(req.body.primary_image_index || 0);
    for (const [index, file] of (req.files || []).entries()) {
      await conn.execute(
        'INSERT INTO product_images (product_id, image_path, is_primary, sort_order) VALUES (?, ?, ?, ?)',
        [result.insertId, buildUploadPath(file), index === primaryIndex, index + 1],
      );
    }
    await conn.commit();
    return successResponse(res, { id: result.insertId }, 'Product created successfully.', 201);
  } catch (error) {
    if (conn) await conn.rollback();
    return next(error);
  } finally { if (conn) conn.release(); }
};

const updateProduct = async (req, res, next) => {
  let conn;
  try {
    const storeId = await resolveSellerStoreId(req);
    if (!storeId) return errorResponse(res, 'Seller store not found.', 404);
    conn = await db.getConnection();
    const existing = await productRepository.findById(req.params.id);
    if (!existing || existing.store_id !== storeId) return errorResponse(res, 'Product not found.', 404);
    const fields = { ...req.body };
    delete fields.primary_image_index;
    delete fields.stock;
    if (fields.slug === '' || fields.slug === null || fields.slug === undefined) delete fields.slug;
    if (fields.name && !fields.slug) fields.slug = slugify(fields.name);
    const keys = Object.keys(fields);
    await conn.beginTransaction();
    if (keys.length > 0) {
      await conn.execute(`UPDATE products SET ${keys.map((key) => `\`${key}\` = ?`).join(', ')} WHERE id = ? AND store_id = ?`, [...Object.values(fields), req.params.id, storeId]);
    }
    if ((req.files || []).length > 0) {
      await conn.execute('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);
      const primaryIndex = Number(req.body.primary_image_index || 0);
      for (const [index, file] of req.files.entries()) {
        await conn.execute(
          'INSERT INTO product_images (product_id, image_path, is_primary, sort_order) VALUES (?, ?, ?, ?)',
          [req.params.id, buildUploadPath(file), index === primaryIndex, index + 1],
        );
      }
    }
    await conn.commit();
    return successResponse(res, null, 'Product updated successfully.');
  } catch (error) {
    if (conn) await conn.rollback();
    return next(error);
  } finally { if (conn) conn.release(); }
};


const deleteProduct = async (req, res, next) => {
  try {
    const storeId = await resolveSellerStoreId(req);
    if (!storeId) return errorResponse(res, 'Seller store not found.', 404);
    const [result] = await db.execute(
      `UPDATE products SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP, status = 'deleted'
       WHERE id = ? AND store_id = ? AND is_deleted = 0`,
      [req.params.id, storeId],
    );
    if (result.affectedRows === 0) return errorResponse(res, 'Product not found.', 404);
    return successResponse(res, null, 'Product deleted successfully.');
  } catch (error) { return next(error); }
};

const adjustStock = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const storeId = await resolveSellerStoreId(req);
    if (!storeId) return errorResponse(res, 'Seller store not found.', 404);
    await conn.beginTransaction();
    const [products] = await conn.execute('SELECT id, store_id, stock FROM products WHERE id = ? AND store_id = ? AND is_deleted = 0 FOR UPDATE', [req.params.id, storeId]);
    const product = products[0];
    if (!product) throw Object.assign(new Error('Product not found.'), { statusCode: 404 });
    const previousStock = Number(product.stock || 0);
    const quantity = Number(req.body.quantity || 0);
    let newStock = previousStock;
    if (req.body.movement_type === 'IN') newStock = previousStock + quantity;
    if (req.body.movement_type === 'OUT') newStock = previousStock - quantity;
    if (req.body.movement_type === 'ADJUSTMENT') newStock = quantity;
    if (newStock < 0) throw Object.assign(new Error('Stock cannot be negative.'), { statusCode: 409 });
    await conn.execute('UPDATE products SET stock = ? WHERE id = ? AND store_id = ?', [newStock, req.params.id, storeId]);
    await recordStockMovement(conn, {
      productId: req.params.id,
      userId: req.user.id,
      movementType: req.body.movement_type,
      quantity,
      previousStock,
      newStock,
      reason: req.body.reason,
    });
    await conn.commit();
    return successResponse(res, { previous_stock: previousStock, new_stock: newStock }, 'Stock adjusted successfully.');
  } catch (error) {
    await conn.rollback();
    return errorResponse(res, error.message || 'Unable to adjust stock.', error.statusCode || 500);
  } finally { conn.release(); }
};

const listStockMovements = async (req, res, next) => {
  try {
    const storeId = await resolveSellerStoreId(req);
    if (!storeId) return errorResponse(res, 'Seller store not found.', 404);
    const [movements] = await db.execute(
      `SELECT sm.*, u.name AS user_name
       FROM stock_movements sm
       JOIN products p ON p.id = sm.product_id
       LEFT JOIN users u ON u.id = sm.user_id
       WHERE sm.product_id = ? AND p.store_id = ?
       ORDER BY sm.created_at DESC LIMIT 100`,
      [req.params.id, storeId],
    );
    return successResponse(res, { movements }, 'Stock movements retrieved successfully.');
  } catch (error) { return next(error); }
};

module.exports = { listProducts, getProduct, getProductById, createProduct, updateProduct, deleteProduct, adjustStock, listStockMovements, createReview };
