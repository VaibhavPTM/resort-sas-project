/**
 * JWT authentication middleware.
 * Expects token in Authorization header as "Bearer <token>" or in cookie "token".
 */
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { error } = require('../utils/ApiResponse');

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return req.cookies?.token || null;
};

/**
 * Protect routes: require valid JWT and attach req.user.
 */
const protect = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return error(res, 'Authentication required. Please log in.', 401);
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub).select('-password');
    if (!user) {
      return error(res, 'User no longer exists.', 401);
    }
    if (!user.isActive) {
      return error(res, 'Account is deactivated.', 403);
    }

    req.user = user;
    next();
  } catch (err) {
    return error(res, err.name === 'TokenExpiredError' ? 'Token expired. Please log in again.' : 'Invalid token.', 401);
  }
};

/**
 * Optional auth: attach req.user if valid token present, otherwise continue without user.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return next();

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub).select('-password');
    if (user && user.isActive) req.user = user;
    next();
  } catch {
    next();
  }
};

module.exports = { protect, optionalAuth, getTokenFromRequest };
