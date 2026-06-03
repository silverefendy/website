const db = require('../config/db');

const findById = async (id) => {
  const [categories] = await db.execute('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);
  return categories[0] || null;
};

const list = async () => {
  const [categories] = await db.execute('SELECT id, name, slug, description, image, parent_id FROM categories ORDER BY name ASC');
  return categories;
};

module.exports = { findById, list };
