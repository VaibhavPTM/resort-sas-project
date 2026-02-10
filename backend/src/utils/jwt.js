/**
 * JWT token generation and verification utilities.
 */
const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate access token for a user.
 * Payload includes userId (sub) and email for use without DB lookup when needed.
 * @param {string} userId - MongoDB user _id
 * @param {string} email - User email
 * @returns {string} Signed JWT
 */
const generateAccessToken = (userId, email) => {
  return jwt.sign(
    { sub: userId, userId, email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * Generate refresh token (longer expiry). Optional for future use.
 * @param {string} userId - MongoDB user _id
 * @param {string} email - User email
 * @returns {string} Signed JWT
 */
const generateRefreshToken = (userId, email) => {
  return jwt.sign(
    { sub: userId, userId, email, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
};

/**
 * Verify JWT and return decoded payload.
 * @param {string} token - JWT string
 * @returns {{ sub: string, userId: string, email: string }} Decoded payload; throws if invalid
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
