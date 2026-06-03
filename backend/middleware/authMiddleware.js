const { verifyAccessToken } = require('../helpers/jwtHelper');
const { errorResponse } = require('../helpers/responseHelper');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Unauthorized', 401);
  }

  const token = authHeader.slice('Bearer '.length).trim();

  if (!token) {
    return errorResponse(res, 'Unauthorized', 401);
  }

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded.id || !decoded.email || !decoded.role_id) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role_id: decoded.role_id,
      store_id: decoded.store_id,
    };

    return next();
  } catch (error) {
    return errorResponse(res, 'Unauthorized', 401);
  }
};

module.exports = authMiddleware;
