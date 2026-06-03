const db = require('../config/db');

const publicStoreSelect = 'id, store_name, slug, description, logo, banner, address, city, province, postal_code, is_active';

const findByUserId = async (userId) => {
  const [stores] = await db.execute(
    `SELECT ${publicStoreSelect} FROM stores WHERE user_id = ? LIMIT 1`,
    [userId],
  );

  return stores[0] || null;
};

const findIdByUserId = async (connection, userId) => {
  const [stores] = await connection.execute('SELECT id FROM stores WHERE user_id = ? LIMIT 1', [userId]);
  return stores[0] || null;
};

const create = async (connection, store) => {
  const [result] = await connection.execute(
    `INSERT INTO stores (user_id, store_name, slug, description, address, city, province, postal_code, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
    [
      store.user_id,
      store.store_name,
      store.slug,
      store.description || null,
      store.address || null,
      store.city || null,
      store.province || null,
      store.postal_code || null,
    ],
  );

  return result.insertId;
};

const updateByUserId = async (connection, userId, fields) => {
  const keys = Object.keys(fields);

  if (keys.length === 0) {
    return;
  }

  const assignments = keys.map((field) => `${field} = ?`).join(', ');
  await connection.execute(`UPDATE stores SET ${assignments} WHERE user_id = ?`, [...Object.values(fields), userId]);
};

module.exports = {
  findByUserId,
  findIdByUserId,
  create,
  updateByUserId,
};
