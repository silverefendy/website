class AppError extends Error {
  constructor(message, statusCode = 400, errors = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

const missingColumnMatch = (message = '') => message.match(/Unknown column '([^']+)'/i);

const toPublicError = (error) => {
  const missingColumn = error.code === 'ER_BAD_FIELD_ERROR' ? missingColumnMatch(error.message) : null;
  if (missingColumn) {
    const column = missingColumn[1].split('.').pop();
    const message = `Database schema mismatch: Missing DB column: ${column}`;
    console.error(`[db:schema-mismatch] ${message}`);

    return {
      message,
      statusCode: 500,
      expose: true,
      errors: process.env.NODE_ENV === 'development' ? error.stack || error.message : null,
    };
  }

  const statusCode = error.statusCode || error.status || 500;
  const isOperational = error instanceof AppError || statusCode < 500;

  return {
    message: isOperational ? error.message : 'Internal server error.',
    statusCode,
    expose: isOperational,
    errors: error.errors || (process.env.NODE_ENV === 'development' ? error.stack || error.message : null),
  };
};

module.exports = {
  AppError,
  toPublicError,
};
