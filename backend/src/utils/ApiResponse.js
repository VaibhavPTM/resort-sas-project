/**
 * Consistent API response helpers for success and error payloads.
 */

const success = (res, data = null, message = 'Success', statusCode = 200) => {
  const payload = { success: true, message };
  if (data !== null && data !== undefined) payload.data = data;
  return res.status(statusCode).json(payload);
};

const error = (res, message = 'Something went wrong', statusCode = 500, details = null) => {
  const payload = { success: false, message };
  if (details !== null && details !== undefined) payload.errors = details;
  return res.status(statusCode).json(payload);
};

module.exports = { success, error };
