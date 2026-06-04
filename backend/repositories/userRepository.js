const db = require('../config/db');

const publicUserSelect = `users.id, users.name, users.email, users.phone, users.avatar, users.role_id,
  roles.name AS role, users.is_active, users.can_become_seller, users.can_become_seller AS canBecomeSeller, users.seller_status, users.seller_status AS sellerStatus, users.email_verified_at, users.created_at, users.updated_at`;

const findByEmail = async (email) => {
  const [users] = await db.execute(
    `SELECT users.id, users.name, users.email, users.password, users.phone, users.avatar,
            users.role_id, roles.name AS role, users.is_active, users.can_become_seller, users.can_become_seller AS canBecomeSeller, users.seller_status, users.seller_status AS sellerStatus
     FROM users
     INNER JOIN roles ON roles.id = users.role_id
     WHERE users.email = ?
     LIMIT 1`,
    [email],
  );

  return users[0] || null;
};

const findIdByEmail = async (email) => {
  const [users] = await db.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
  return users[0] || null;
};

const findPublicById = async (id) => {
  const [users] = await db.execute(
    `SELECT ${publicUserSelect}
     FROM users
     INNER JOIN roles ON roles.id = users.role_id
     WHERE users.id = ?
     LIMIT 1`,
    [id],
  );

  return users[0] || null;
};

const findPasswordById = async (id) => {
  const [users] = await db.execute('SELECT id, password FROM users WHERE id = ? LIMIT 1', [id]);
  return users[0] || null;
};

const create = async (connection, user) => {
  const [result] = await connection.execute(
    'INSERT INTO users (name, email, password, role_id, is_active) VALUES (?, ?, ?, ?, TRUE)',
    [user.name, user.email, user.password, user.role_id],
  );

  return result.insertId;
};

const updateProfile = async (connection, id, fields) => {
  const keys = Object.keys(fields);

  if (keys.length === 0) {
    return;
  }

  const assignments = keys.map((field) => `${field} = ?`).join(', ');
  await connection.execute(`UPDATE users SET ${assignments} WHERE id = ?`, [...Object.values(fields), id]);
};

const updatePassword = async (id, hashedPassword) => {
  await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
};

module.exports = {
  findByEmail,
  findIdByEmail,
  findPublicById,
  findPasswordById,
  create,
  updateProfile,
  updatePassword,
};
