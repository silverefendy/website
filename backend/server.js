const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const appConfig = require('./config/app');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const locationRoutes = require('./routes/locationRoutes');
const { successResponse, errorResponse } = require('./helpers/responseHelper');
const { toPublicError } = require('./helpers/errorHelper');
const sanitizeMiddleware = require('./middleware/sanitizeMiddleware');
const cookieMiddleware = require('./middleware/cookieMiddleware');
const { resolveUploadDirectory } = require('./helpers/uploadHelper');

const app = express();

const normalizeOrigin = (origin) => origin?.replace(/\/$/, '');

const isDevelopmentOrigin = (origin) => {
  if (appConfig.isProduction || !origin) {
    return false;
  }

  try {
    const parsedOrigin = new URL(origin);
    const { hostname, protocol } = parsedOrigin;

    if (!['http:', 'https:'].includes(protocol)) {
      return false;
    }

    return hostname === 'localhost'
      || hostname === '127.0.0.1'
      || hostname === '::1'
      || hostname === '[::1]'
      || /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)
      || /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)
      || /^100\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);
  } catch (error) {
    return false;
  }
};

const logCorsDecision = (decision, origin, reason) => {
  const logger = decision === 'rejected' ? console.warn : console.info;
  logger(`[cors:${decision}]`, { origin: origin || '(none)', reason });
};

const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = appConfig.allowedOrigins || [];
    const normalizedOrigin = normalizeOrigin(origin);

    // Requests without Origin (curl, Postman, health checks, same-origin server
    // calls) are not browser CORS requests and must not be blocked.
    if (!normalizedOrigin) {
      logCorsDecision('allowed', normalizedOrigin, 'missing-origin');
      return callback(null, true);
    }

    if (allowedOrigins.includes(normalizedOrigin)) {
      logCorsDecision('allowed', normalizedOrigin, 'configured-allow-list');
      return callback(null, true);
    }

    if (isDevelopmentOrigin(normalizedOrigin)) {
      logCorsDecision('allowed', normalizedOrigin, 'development-local-or-lan-origin');
      return callback(null, true);
    }

    logCorsDecision('rejected', normalizedOrigin, 'not-in-allow-list');
    const error = new Error('Origin is not allowed by CORS.');
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors(corsOptions));
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.URLENCODED_BODY_LIMIT || '1mb' }));
app.use(cookieMiddleware);
app.use(sanitizeMiddleware);

const uploadDirectory = resolveUploadDirectory();
app.use('/uploads', express.static(uploadDirectory));

app.get('/api/health', (req, res) => {
  return successResponse(res, { status: 'ok' }, 'API server is healthy.');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/locations', locationRoutes);

app.use('/api', (req, res) => {
  return errorResponse(res, 'API route not found.', 404);
});

app.use((err, req, res, next) => {
  const publicError = toPublicError(err);
  const statusCode = publicError.statusCode;
  const message = statusCode === 500 ? 'Internal server error.' : publicError.message;
  const errors = process.env.NODE_ENV === 'development' ? publicError.errors || err.stack : publicError.errors;

  console.error('[api:error]', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    code: err.code,
    message: err.message,
    stack: err.stack,
  });

  return errorResponse(res, message, statusCode, errors);
});

app.listen(appConfig.port, () => {
  console.log(`API server is running on port ${appConfig.port}`);
  console.log('[cors:configured-origins]', appConfig.allowedOrigins);
  if (!appConfig.isProduction) {
    console.log('[cors:development-origin-patterns]', ['localhost', '127.0.0.1', '[::1]', '10.*', '192.168.*', '100.*']);
  }
});
