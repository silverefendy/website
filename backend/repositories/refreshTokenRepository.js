const db = require('../config/db');

const create = async (connection, token) => {
  await connection.execute(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, user_agent, ip_address)
     VALUES (?, ?, ?, ?, ?)`,
    [token.user_id, token.token_hash, token.expires_at, token.user_agent || null, token.ip_address || null],
  );
};

const findActiveByHash = async (tokenHash) => {
  const [tokens] = await db.execute(
    `SELECT refresh_tokens.*, users.email, users.role_id, users.is_active
     FROM refresh_tokens
     INNER JOIN users ON users.id = refresh_tokens.user_id
     WHERE refresh_tokens.token_hash = ?
       AND refresh_tokens.revoked_at IS NULL
       AND refresh_tokens.expires_at > CURRENT_TIMESTAMP
     LIMIT 1`,
    [tokenHash],
  );

  return tokens[0] || null;
};

const revokeByHash = async (connection, tokenHash) => {
  await connection.execute(
    'UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE token_hash = ? AND revoked_at IS NULL',
    [tokenHash],
  );
};

const revokeAllForUser = async (connection, userId) => {
  await connection.execute(
    'UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = ? AND revoked_at IS NULL',
    [userId],
  );
};

module.exports = {
  create,
  findActiveByHash,
  revokeByHash,
  revokeAllForUser,
};
