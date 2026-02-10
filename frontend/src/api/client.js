/**
 * API client for the backend. Uses Vite proxy: /api -> localhost:3000
 * Attaches JWT from localStorage when present.
 */

const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders(includeAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (includeAuth && token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || res.statusText || 'Request failed');
    err.status = res.status;
    err.details = data.errors;
    throw err;
  }
  return data;
}

export const api = {
  async post(path, body, auth = true) {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: getHeaders(auth),
      body: JSON.stringify(body),
      credentials: 'include',
    });
    return handleResponse(res);
  },

  async get(path, auth = true) {
    const res = await fetch(`${BASE}${path}`, {
      method: 'GET',
      headers: getHeaders(auth),
      credentials: 'include',
    });
    return handleResponse(res);
  },
};

export default api;
