const db = require('../config/db');

/**
 * Database repository utilities own connection and transaction handling.
 * Services use these helpers so business logic never needs raw SQL details.
 */
const withTransaction = async (callback) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  withTransaction,
};
