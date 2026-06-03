const { verifyAccessToken } = require('../helpers/jwtHelper');

const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();

  try {
    const decoded = verifyAccessToken(authHeader.slice('Bearer '.length).trim());
    if (decoded.id && decoded.email && decoded.role_id) {
      req.user = { id: decoded.id, email: decoded.email, role_id: decoded.role_id, store_id: decoded.store_id };
    }
  } catch (error) {
    // Public product routes still work for guests when an expired token is present.
  }
  return next();
};

module.exports = optionalAuthMiddleware;
