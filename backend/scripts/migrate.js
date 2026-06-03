const fs = require('fs/promises');
const path = require('path');
const pool = require('../config/db');

const run = async () => {
  const migrationFile = process.argv[2];

  if (!migrationFile) {
    throw new Error('Provide a SQL file path, for example: npm run migrate -- ./migrations/schema.sql');
  }

  const sqlPath = path.resolve(process.cwd(), migrationFile);
  const sql = await fs.readFile(sqlPath, 'utf8');

  const connection = await pool.getConnection();
  try {
    await connection.query(sql);
    console.log(`Migration executed: ${sqlPath}`);
  } finally {
    connection.release();
    await pool.end();
  }
};

run().catch(async (error) => {
  console.error(error.message);
  await pool.end();
  process.exit(1);
});
