const express = require('express');
const cors = require('cors');
const path = require('path');
const appConfig = require('./config/app');
const authRoutes = require('./routes/authRoutes');
const { successResponse, errorResponse } = require('./helpers/responseHelper');

const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || appConfig.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const error = new Error('Origin is not allowed by CORS.');
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDirectory = path.resolve(process.cwd(), appConfig.uploadDir || process.env.UPLOAD_DIR || 'uploads/');
app.use('/uploads', express.static(uploadDirectory));

app.get('/api/health', (req, res) => {
  return successResponse(res, { status: 'ok' }, 'API server is healthy.');
});

app.use('/api/auth', authRoutes);

app.use('/api', (req, res) => {
  return errorResponse(res, 'API route not found.', 404);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode === 500 ? 'Internal server error.' : err.message;
  const errors = process.env.NODE_ENV === 'development' ? err.stack : null;

  return errorResponse(res, message, statusCode, errors);
});

app.listen(appConfig.port, () => {
  console.log(`API server is running on port ${appConfig.port}`);
});
