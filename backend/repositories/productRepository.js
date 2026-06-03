/**
 * Product repository placeholder for future product controllers.
 * Keep all product SQL in this module as product endpoints are implemented.
 */
const db = require('../config/db');

const findById = async (id) => {
  const [products] = await db.execute('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
  return products[0] || null;
};

module.exports = {
  findById,
};
