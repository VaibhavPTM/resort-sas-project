import api from './client';

export async function login(email, password) {
  const data = await api.post('/auth/login', { email, password }, false);
  if (data.data?.token) localStorage.setItem('token', data.data.token);
  if (data.data?.user) localStorage.setItem('user', JSON.stringify(data.data.user));
  return data;
}

export async function signup(email, password, name = '') {
  const data = await api.post('/auth/signup', { email, password, name }, false);
  if (data.data?.token) localStorage.setItem('token', data.data.token);
  if (data.data?.user) localStorage.setItem('user', JSON.stringify(data.data.user));
  return data;
}

export async function googleLogin(credential) {
  const data = await api.post('/auth/google', { credential }, false);
  if (data.data?.token) localStorage.setItem('token', data.data.token);
  if (data.data?.user) localStorage.setItem('user', JSON.stringify(data.data.user));
  return data;
}

export async function getMe() {
  return api.get('/auth/me');
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}
