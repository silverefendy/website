const db = require('../config/db');

const SORTS = {
  newest: 'p.created_at DESC',
  price_asc: 'p.price ASC',
  price_low: 'p.price ASC',
  price_desc: 'p.price DESC',
  price_high: 'p.price DESC',
  popularity: 'p.views DESC',
  popular: 'p.views DESC',
};

const toInt = (value, fallback, min = 1, max = 100) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
};

const baseSelect = `
  SELECT p.*, c.name AS category_name, c.slug AS category_slug, s.store_name, s.slug AS store_slug,
    (SELECT image_path FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC, id ASC LIMIT 1) AS primary_image,
    COALESCE((SELECT ROUND(AVG(rating), 1) FROM product_reviews WHERE product_id = p.id), 0) AS average_rating,
    (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id) AS review_count
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  JOIN stores s ON s.id = p.store_id
`;

const buildProductFilters = (filters = {}, alias = 'p') => {
  const where = [`${alias}.status = 'active'`, `${alias}.is_deleted = FALSE`, 's.is_active = TRUE'];
  const params = [];

  if (filters.search) {
    where.push(`(${alias}.name LIKE ? OR ${alias}.description LIKE ? OR c.name LIKE ?)`);
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }
  if (filters.keyword) {
    where.push(`(${alias}.name LIKE ? OR ${alias}.description LIKE ?)`);
    const term = `%${filters.keyword}%`;
    params.push(term, term);
  }
  if (filters.category) {
    if (/^\d+$/.test(String(filters.category))) {
      where.push(`${alias}.category_id = ?`);
      params.push(Number(filters.category));
    } else {
      where.push('c.slug = ?');
      params.push(filters.category);
    }
  }
  if (filters.min_price !== undefined && filters.min_price !== '') {
    where.push(`${alias}.price >= ?`);
    params.push(Number(filters.min_price));
  }
  if (filters.max_price !== undefined && filters.max_price !== '') {
    where.push(`${alias}.price <= ?`);
    params.push(Number(filters.max_price));
  }
  if (filters.condition) {
    where.push(`${alias}.condition = ?`);
    params.push(filters.condition);
  }
  return { where: where.join(' AND '), params };
};

const list = async (filters = {}) => {
  const page = toInt(filters.page, 1, 1, 100000);
  const limit = toInt(filters.limit, 12, 1, 50);
  const offset = (page - 1) * limit;
  const sort = SORTS[filters.sort] || SORTS.newest;
  const { where, params } = buildProductFilters(filters);

  const [countRows] = await db.execute(
    `SELECT COUNT(DISTINCT p.id) AS total FROM products p LEFT JOIN categories c ON c.id = p.category_id JOIN stores s ON s.id = p.store_id WHERE ${where}`,
    params,
  );
  const total = Number(countRows[0]?.total || 0);
  const [products] = await db.execute(
    `${baseSelect} WHERE ${where} ORDER BY ${sort} LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  return {
    products,
    pagination: { total, totalPages: Math.max(Math.ceil(total / limit), 1), currentPage: page, page, limit },
  };
};

const findById = async (id) => {
  const [products] = await db.execute('SELECT * FROM products WHERE id = ? AND is_deleted = FALSE LIMIT 1', [id]);
  return products[0] || null;
};

const findDetailBySlug = async (slug, userId = null) => {
  const [rows] = await db.execute(
    `${baseSelect}
     WHERE p.slug = ? AND p.status = 'active' AND p.is_deleted = FALSE AND s.is_active = TRUE
     LIMIT 1`,
    [slug],
  );
  const product = rows[0] || null;
  if (!product) return null;

  await db.execute('UPDATE products SET views = views + 1 WHERE id = ?', [product.id]);
  product.views = Number(product.views || 0) + 1;

  const [images] = await db.execute('SELECT id, image_path, is_primary, sort_order FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC, id ASC', [product.id]);
  const [reviews] = await db.execute(
    `SELECT pr.id, pr.rating, pr.comment, pr.created_at, u.name AS user_name
     FROM product_reviews pr JOIN users u ON u.id = pr.user_id
     WHERE pr.product_id = ? ORDER BY pr.created_at DESC`,
    [product.id],
  );
  product.images = images;
  product.reviews = reviews;
  product.can_review = Boolean(userId);
  product.is_wishlisted = false;
  if (userId) {
    const [wish] = await db.execute('SELECT id FROM wishlists WHERE user_id = ? AND product_id = ? LIMIT 1', [userId, product.id]);
    product.is_wishlisted = wish.length > 0;
  }
  return product;
};

const upsertReview = async ({ productId, userId, rating, comment }) => {
  await db.execute(
    `INSERT INTO product_reviews (product_id, user_id, rating, comment)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), updated_at = CURRENT_TIMESTAMP`,
    [productId, userId, rating, comment || null],
  );
};

const listSellerProducts = async (storeId) => {
  const [rows] = await db.execute(
    `SELECT p.*,
       (SELECT image_path FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC, id ASC LIMIT 1) AS primary_image
     FROM products p
     WHERE p.store_id = ? AND p.is_deleted = FALSE ORDER BY p.created_at DESC`,
    [storeId],
  );
  return rows;
};

module.exports = { list, findById, findDetailBySlug, upsertReview, listSellerProducts };
