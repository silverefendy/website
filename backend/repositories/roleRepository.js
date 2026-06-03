const db = require('../config/db');

const findByName = async (name) => {
  const [roles] = await db.execute('SELECT id, name FROM roles WHERE name = ? LIMIT 1', [name]);
  return roles[0] || null;
};

module.exports = {
  findByName,
};
