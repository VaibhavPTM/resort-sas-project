/**
 * Hotel Management System - Backend entry point.
 * Connects to MongoDB and starts the Express server.
 */
const app = require('./app');
const config = require('./config');
const connectDB = require('./config/db');

const start = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server running in ${config.env} on port ${config.port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
