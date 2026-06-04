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
const { successResponse, errorResponse } = require('./helpers/responseHelper');
const { toPublicError } = require('./helpers/errorHelper');
const sanitizeMiddleware = require('./middleware/sanitizeMiddleware');
const cookieMiddleware = require('./middleware/cookieMiddleware');
const { resolveUploadDirectory } = require('./helpers/uploadHelper');

const app = express();

const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = appConfig.allowedOrigins || [];
    const normalizedOrigin = origin?.replace(/\/$/, '');

    // Browsers send an Origin header for cross-origin frontend calls. The
    // normalized allow-list comes from ALLOWED_ORIGINS plus safe dev defaults.
    // Requests without Origin (curl, health checks, same-origin server calls) are allowed.
    const isDevelopmentLocalhost = !appConfig.isProduction
      && /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(normalizedOrigin || '');

    if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin) || isDevelopmentLocalhost) {
      return callback(null, true);
    }

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
});
