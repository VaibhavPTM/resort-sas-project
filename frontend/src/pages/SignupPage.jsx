import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup } from '../api/auth';
import '../styles/index.css';
import './AuthLayout.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!email.trim()) err.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) err.email = 'Please enter a valid email';
    if (!password) err.password = 'Password is required';
    else if (password.length < 6) err.password = 'Password must be at least 6 characters';
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await signup(email.trim(), password, name.trim());
      if (res.data?.user) setUser(res.data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-panel auth-panel-form">
        <div className="auth-form-card">
          <div className="auth-brand">
            <div className="auth-logo" />
            <h1 className="auth-title">Hotel Management</h1>
            <p className="auth-subtitle">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="alert alert-error" role="alert">
                {error}
              </div>
            )}

            <div className="input-wrap">
              <label htmlFor="signup-name">Full name (optional)</label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-wrap">
              <label htmlFor="signup-email">Email address</label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldErrors.email ? 'error' : ''}
              />
              {fieldErrors.email && <div className="input-error">{fieldErrors.email}</div>}
            </div>

            <div className="input-wrap">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldErrors.password ? 'error' : ''}
              />
              {fieldErrors.password && <div className="input-error">{fieldErrors.password}</div>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="auth-panel auth-panel-brand">
        <div className="auth-brand-bg">
          <div className="auth-brand-pattern" />
          <div className="auth-brand-content">
            <p className="auth-tagline">Manage your property with confidence</p>
            <p className="auth-tagline-sub">Reservations, guests, and operations in one place.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
