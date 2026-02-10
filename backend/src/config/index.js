/**
 * Application configuration loaded from environment variables.
 * All sensitive and environment-specific values are centralized here.
 */
require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,

  // MongoDB
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27027/hotel_management',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },

  // CORS / Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// Warn if critical config is missing in production
if (config.env === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === config.jwt.secret) {
    console.warn('Warning: JWT_SECRET should be set to a strong random value in production.');
  }
  if (!config.google.clientId || !config.google.clientSecret) {
    console.warn('Warning: Google OAuth credentials not set. Google login will not work.');
  }
}

module.exports = config;
