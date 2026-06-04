const db = require('../config/db');
const productRepository = require('../repositories/productRepository');
const { successResponse, errorResponse } = require('../helpers/responseHelper');
const { slugify } = require('../helpers/stringHelper');
const { buildPublicUploadPath } = require('../helpers/uploadHelper');

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
  const [stores] = await db.execute('SELECT id FROM stores WHERE user_id = ? LIMIT 1', [req.user.id]);
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
      `INSERT INTO products (store_id, category_id, name, slug, description, price, stock, weight, \`condition\`, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [storeId, req.body.category_id, req.body.name, productSlug, req.body.description, req.body.price, req.body.stock, req.body.weight, req.body.condition, req.body.status],
    );
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

module.exports = { listProducts, getProduct, getProductById, createProduct, updateProduct, createReview };
