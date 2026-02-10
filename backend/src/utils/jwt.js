/**
 * JWT token generation and verification utilities.
 */
const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate access token for a user.
 * @param {string} userId - MongoDB user _id
 * @returns {string} Signed JWT
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { sub: userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * Generate refresh token (longer expiry). Optional for future use.
 * @param {string} userId - MongoDB user _id
 * @returns {string} Signed JWT
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { sub: userId, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
};

/**
 * Verify JWT and return decoded payload.
 * @param {string} token - JWT string
 * @returns {{ sub: string }} Decoded payload; throws if invalid
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
