class AppError extends Error {
  constructor(message, statusCode = 400, errors = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

const toPublicError = (error) => {
  const statusCode = error.statusCode || error.status || 500;
  const isOperational = error instanceof AppError || statusCode < 500;

  return {
    message: isOperational ? error.message : 'Internal server error.',
    statusCode,
    errors: error.errors || (process.env.NODE_ENV === 'development' ? error.stack || error.message : null),
  };
};

module.exports = {
  AppError,
  toPublicError,
};
