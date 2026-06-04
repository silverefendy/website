require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toOriginList = (value) => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const requireEnv = (name, fallback) => {
  const value = process.env[name] ?? fallback;

  if (isProduction && (value === undefined || value === null || value === '')) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const validateProductionSecret = (name, value) => {
  if (!isProduction) return;

  const unsafeValues = new Set(['change-this-docker-secret', 'change-me', 'secret', 'password']);
  if (!value || value.length < 32 || unsafeValues.has(value)) {
    throw new Error(`${name} must be at least 32 characters and must not use a default placeholder in production.`);
  }
};

const port = toNumber(process.env.PORT, 5000);
const jwtSecret = requireEnv('JWT_SECRET', isProduction ? undefined : 'development-only-jwt-secret-change-me');
const allowedOrigins = toOriginList(process.env.ALLOWED_ORIGINS);

if (isProduction && allowedOrigins.length === 0) {
  throw new Error('ALLOWED_ORIGINS must include at least one trusted frontend origin in production.');
}

validateProductionSecret('JWT_SECRET', jwtSecret);

module.exports = {
  isProduction,

  // HTTP port used by the Express server.
  port,

  // MySQL connection settings consumed by the shared connection pool.
  db: {
    host: requireEnv('DB_HOST', isProduction ? undefined : 'localhost'),
    port: toNumber(process.env.DB_PORT, 3306),
    user: requireEnv('DB_USER', isProduction ? undefined : 'root'),
    password: requireEnv('DB_PASSWORD', isProduction ? undefined : ''),
    name: requireEnv('DB_NAME', isProduction ? undefined : 'marketplace'),
  },

  // JSON Web Token settings used by authentication middleware and controllers.
  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  // Customer support WhatsApp number supplied by deployment configuration.
  whatsapp: process.env.WHATSAPP_NUMBER,

  // Relative or absolute directory where uploaded files are stored.
  uploadDir: process.env.UPLOAD_DIR || 'uploads/',

  // Maximum single uploaded file size in bytes.
  maxFileSize: toNumber(process.env.MAX_FILE_SIZE, 5 * 1024 * 1024),

  // Comma-separated list of frontend origins allowed to call the API.
  allowedOrigins,
};
