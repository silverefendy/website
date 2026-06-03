/**
 * Category repository placeholder for future category controllers.
 * Category SQL belongs here, not in controllers or services.
 */
const db = require('../config/db');

const findById = async (id) => {
  const [categories] = await db.execute('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);
  return categories[0] || null;
};

module.exports = {
  findById,
};
