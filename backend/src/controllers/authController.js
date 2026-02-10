/**
 * Authentication controller: signup, login, Google OAuth, and current user.
 */
const User = require('../models/User');
const { success, error } = require('../utils/ApiResponse');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { OAuth2Client } = require('google-auth-library');
const config = require('../config');

const googleClient = config.google.clientId
  ? new OAuth2Client(config.google.clientId, config.google.clientSecret)
  : null;

/**
 * POST /api/auth/signup
 * Register a new user with email and password.
 */
const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return error(res, 'An account with this email already exists.', 409);
    }

    const user = await User.create({
      email,
      password,
      name: name || '',
      provider: 'local',
    });

    const token = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const userObj = user.toJSON();
    delete userObj.password;

    return success(res, { user: userObj, token, refreshToken }, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Login with email and password; returns JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return error(res, 'Invalid email or password.', 401);
    }

    if (user.provider === 'google') {
      return error(res, 'This account uses Google sign-in. Please log in with Google.', 400);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return error(res, 'Invalid email or password.', 401);
    }

    if (!user.isActive) {
      return error(res, 'Account is deactivated.', 403);
    }

    const token = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const userObj = user.toJSON();
    delete userObj.password;

    return success(res, { user: userObj, token, refreshToken }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/google
 * Login or signup using Google ID token (from frontend OAuth flow).
 * Body: { credential: "<id_token>" }
 */
const googleAuth = async (req, res, next) => {
  try {
    if (!googleClient) {
      return error(res, 'Google OAuth is not configured.', 503);
    }

    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return error(res, 'Google account did not provide an email.', 400);
    }

    let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] }).select('+password');

    if (user) {
      // Link Google to existing account if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = user.avatar || picture;
        user.name = user.name || name || '';
        await user.save({ validateBeforeSave: false });
      } else {
        // Update profile from Google if needed
        if (!user.avatar && picture) user.avatar = picture;
        if (!user.name && name) user.name = name;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      user = await User.create({
        email: email.toLowerCase(),
        name: name || '',
        avatar: picture || null,
        provider: 'google',
        googleId,
      });
    }

    if (!user.isActive) {
      return error(res, 'Account is deactivated.', 403);
    }

    const token = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const userObj = user.toJSON();
    delete userObj.password;

    return success(res, { user: userObj, token, refreshToken }, 'Login successful');
  } catch (err) {
    if (err.message && err.message.includes('Token used too late')) {
      return error(res, 'Google token expired. Please try again.', 401);
    }
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Return current authenticated user (requires protect middleware).
 */
const getMe = async (req, res, next) => {
  try {
    return success(res, { user: req.user }, 'OK');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  googleAuth,
  getMe,
};
