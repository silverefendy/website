const DANGEROUS_PATTERN = /<\/?script|javascript:|on\w+=/gi;

const sanitizeString = (value) => value.replace(DANGEROUS_PATTERN, '').trim();

const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((accumulator, [key, nestedValue]) => {
      accumulator[key] = sanitizeValue(nestedValue);
      return accumulator;
    }, {});
  }

  return value;
};

const sanitizeMiddleware = (req, res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  return next();
};

module.exports = sanitizeMiddleware;
