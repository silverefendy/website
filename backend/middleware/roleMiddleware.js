const hasRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication is required.' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have permission to access this resource.' });
  }

  return next();
};

const isAdmin = hasRole(['admin']);
const isSeller = hasRole(['seller']);
const isCustomer = hasRole(['customer']);

module.exports = {
  hasRole,
  isAdmin,
  isSeller,
  isCustomer,
};
