/**
 * Order repository placeholder for future order controllers.
 * Order SQL belongs here, not in controllers or services.
 */
const db = require('../config/db');

const findById = async (id) => {
  const [orders] = await db.execute('SELECT * FROM orders WHERE id = ? LIMIT 1', [id]);
  return orders[0] || null;
};

module.exports = {
  findById,
};
