const fs = require('fs/promises');
const path = require('path');
const pool = require('../config/db');

const stripLineComments = (sql) => sql
  .split(/\r?\n/)
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n');

const splitStatements = (sql) => stripLineComments(sql)
  .split(/;\s*(?:\r?\n|$)/)
  .map((statement) => statement.trim())
  .filter(Boolean);

const IGNORED_IDEMPOTENCY_ERRORS = new Set([
  'ER_DUP_FIELDNAME',
  'ER_DUP_KEYNAME',
]);

const run = async () => {
  const migrationFile = process.argv[2];

  if (!migrationFile) {
    throw new Error('Provide a SQL file path, for example: npm run migrate -- ./migrations/schema.sql');
  }

  const sqlPath = path.resolve(process.cwd(), migrationFile);
  const sql = await fs.readFile(sqlPath, 'utf8');
  const statements = splitStatements(sql);

  const connection = await pool.getConnection();
  try {
    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (error) {
        if (!IGNORED_IDEMPOTENCY_ERRORS.has(error.code)) {
          throw error;
        }
        console.warn(`[migration:skip] ${error.code}: ${error.message}`);
      }
    }
    console.log(`Migration executed: ${sqlPath}`);
  } finally {
    connection.release();
    await pool.end();
  }
};

run().catch(async (error) => {
  console.error(error.message || error.code || error);
  await pool.end();
  process.exit(1);
});
