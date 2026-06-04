const db = require('../config/db');

const findById = async (id) => {
  const [categories] = await db.execute('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);
  return categories[0] || null;
};

const isMissingImageColumnError = (error) => (
  error?.code === 'ER_BAD_FIELD_ERROR'
  && String(error.message || '').includes("'image'")
);

const list = async () => {
  try {
    const [categories] = await db.execute('SELECT id, name, slug, description, image, parent_id FROM categories ORDER BY name ASC');
    return categories;
  } catch (error) {
    if (!isMissingImageColumnError(error)) {
      throw error;
    }

    const [categories] = await db.execute('SELECT id, name, slug, description, NULL AS image, parent_id FROM categories ORDER BY name ASC');
    return categories;
  }
};

module.exports = { findById, list };
