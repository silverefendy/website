const { errorResponse } = require('../helpers/responseHelper');

/**
 * Validation middleware is the only place that knows how Joi errors become API errors.
 * Controllers receive already-normalized input through req.validated.
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  const { value, error } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    const errors = error.details.reduce((accumulator, detail) => {
      const key = detail.path.join('.') || 'value';
      accumulator[key] = detail.message;
      return accumulator;
    }, {});

    return errorResponse(res, 'Validation failed.', 422, errors);
  }

  req.validated = {
    ...(req.validated || {}),
    [source]: value,
  };

  req[source] = value;
  return next();
};

module.exports = validate;
