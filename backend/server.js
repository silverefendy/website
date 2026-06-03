const express = require('express');
const cors = require('cors');
const path = require('path');
const appConfig = require('./config/app');

const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || appConfig.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin is not allowed by CORS.'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDirectory = path.resolve(process.cwd(), appConfig.uploadDir);
app.use('/uploads', express.static(uploadDirectory));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found.' });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode === 500 ? 'Internal server error.' : err.message;

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

app.listen(appConfig.port, () => {
  console.log(`API server is running on port ${appConfig.port}`);
});
