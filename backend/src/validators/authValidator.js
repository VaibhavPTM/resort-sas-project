/**
 * Input validation rules for auth endpoints using express-validator.
 */
const { body, validationResult } = require('express-validator');
const { error } = require('../utils/ApiResponse');

// Validation rules for signup
const signupRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
];

// Validation rules for login
const loginRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Validation rules for Google OAuth (token from frontend)
const googleTokenRules = [
  body('credential')
    .notEmpty()
    .withMessage('Google credential (id_token) is required')
    .isString()
    .withMessage('Credential must be a string'),
];

/**
 * Middleware to run validation and send 422 with errors if validation fails.
 */
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));
  return error(res, 'Validation failed', 422, errors);
};

module.exports = {
  signupRules,
  loginRules,
  googleTokenRules,
  validate,
};
