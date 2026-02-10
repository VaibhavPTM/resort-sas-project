/**
 * Authentication routes: signup, login, Google OAuth, and me.
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  signupRules,
  loginRules,
  googleTokenRules,
  validate,
} = require('../validators/authValidator');

// Public routes
router.post('/signup', signupRules, validate, authController.signup);
router.post('/login', loginRules, validate, authController.login);
router.post('/google', googleTokenRules, validate, authController.googleAuth);

// Protected route
router.get('/me', protect, authController.getMe);

module.exports = router;
