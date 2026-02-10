/**
 * Global error handling middleware.
 * Handles validation errors, JWT errors, Mongoose errors, and generic errors.
 */
const { success, error } = require('../utils/ApiResponse');
const config = require('../config');

// Mongoose duplicate key (e.g. duplicate email)
const isDuplicateKeyError = (err) => err.code === 11000;

// Mongoose validation error (schema rules)
const isValidationError = (err) => err.name === 'ValidationError';

// JWT errors
const isJwtError = (err) => err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError';

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  let details = null;

  if (isDuplicateKeyError(err)) {
    statusCode = 409;
    const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : 'field';
    message = `A record with this ${field} already exists.`;
  } else if (isValidationError(err)) {
    statusCode = 422;
    message = 'Validation failed.';
    details = err.errors
      ? Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }))
      : [message];
  } else if (isJwtError(err)) {
    statusCode = 401;
    message = err.name === 'TokenExpiredError' ? 'Token expired. Please log in again.' : 'Invalid token.';
  }

  // Log server errors; avoid leaking stack in production
  if (statusCode >= 500) {
    console.error('Error:', err);
    if (config.env === 'production') message = 'Internal Server Error';
  }

  return error(res, message, statusCode, details);
};

module.exports = errorHandler;
