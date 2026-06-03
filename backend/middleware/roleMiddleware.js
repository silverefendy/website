const { errorResponse } = require('../helpers/responseHelper');

const ROLE_IDS = {
  admin: 1,
  seller: 2,
  customer: 3,
};

const hasRole = (allowedRoleIds) => (req, res, next) => {
  if (!req.user || !allowedRoleIds.includes(req.user.role_id)) {
    return errorResponse(res, 'Forbidden', 403);
  }

  return next();
};

const isAdmin = hasRole([ROLE_IDS.admin]);
const isSeller = hasRole([ROLE_IDS.admin, ROLE_IDS.seller]);
const isCustomer = hasRole([ROLE_IDS.admin, ROLE_IDS.customer]);

module.exports = {
  isAdmin,
  isSeller,
  isCustomer,
};
