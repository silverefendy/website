require('dotenv').config();

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
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

module.exports = {
  // HTTP port used by the Express server.
  port: toNumber(process.env.PORT),

  // MySQL connection settings consumed by the shared connection pool.
  db: {
    host: process.env.DB_HOST,
    port: toNumber(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },

  // JSON Web Token settings used by authentication middleware and controllers.
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  // Customer support WhatsApp number supplied by deployment configuration.
  whatsapp: process.env.WHATSAPP_NUMBER,

  // Relative or absolute directory where uploaded files are stored.
  uploadDir: process.env.UPLOAD_DIR,

  // Comma-separated list of frontend origins allowed to call the API.
  allowedOrigins: toOriginList(process.env.ALLOWED_ORIGINS),
};
