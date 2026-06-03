const { errorResponse } = require('../helpers/responseHelper');

const attempts = new Map();
const windowMs = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const maxAttempts = Number(process.env.AUTH_RATE_LIMIT_MAX) || 20;

const authRateLimiter = (req, res, next) => {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const current = attempts.get(key) || { count: 0, resetAt: now + windowMs };

  if (current.resetAt <= now) {
    current.count = 0;
    current.resetAt = now + windowMs;
  }

  current.count += 1;
  attempts.set(key, current);

  if (current.count > maxAttempts) {
    res.set('Retry-After', String(Math.ceil((current.resetAt - now) / 1000)));
    return errorResponse(res, 'Too many authentication attempts. Please try again later.', 429);
  }

  return next();
};

module.exports = authRateLimiter;
