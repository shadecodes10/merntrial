import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

// Original placeholder campaign cards for the right-hand panel. These are
// NOT real brands/campaigns — written from scratch so nothing here is
// copied from any real product's marketing content or logos.
const DEMO_CARDS = [
  { title: 'Monsoon Essentials Drop', brand: 'Petal & Pine', tone: 'a', icon: '☔', budget: '₹45k' },
  { title: 'Desk Setup Refresh', brand: 'Northline Co.', tone: 'b', badge: 'Applied', icon: '💻', budget: '₹60k' },
  { title: 'Everyday Carry Series', brand: 'Fieldmark', tone: 'c', icon: '🎒', budget: '₹30k' },
  { title: 'Home Brew Kit Launch', brand: 'Roast & Co.', tone: 'd', icon: '☕', budget: '₹38k' },
  { title: 'Trail Ready Collection', brand: 'Altitude', tone: 'e', badge: 'Invited', icon: '⛰️', budget: '₹75k' },
  { title: 'City Commute Bikes', brand: 'Loop Cycles', tone: 'f', icon: '🚲', budget: '₹52k' },
];

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT — the actual login card */}
      <div className="auth-left">
        <div className="auth-card">
          <h1 className="auth-title">Creator Hub<br />Portal</h1>
          <p className="auth-subtitle">
            Log in or sign up to manage collaborations and discover campaigns
            in the Creator Marketplace.
          </p>

          <button type="button" className="oauth-btn" title="Not wired up in this student build">
            <GoogleIcon /> Continue with Google
          </button>
          <button type="button" className="oauth-btn" title="Not wired up in this student build">
            <MicrosoftIcon /> Continue with Microsoft
          </button>

          <div className="auth-divider"><span>Or</span></div>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="auth-label">Enter your email to continue</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />

            <label className="auth-label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required />

            <button type="submit" className="auth-continue-btn">Continue with email</button>
          </form>

          <div className="auth-passkey">🔑 Sign in with passkey</div>

          <p className="auth-terms">
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </p>

          <p className="muted" style={{ textAlign: 'center', marginTop: 16 }}>
            No account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

      {/* RIGHT — dotted dark panel with floating campaign cards */}
      <div className="auth-right">
        <div className="auth-float-grid">
          {DEMO_CARDS.map((c, i) => (
            <div className={`float-card tone-${c.tone}`} key={i}>
              {c.badge && <span className="float-badge">{c.badge}</span>}
              <div className="float-thumb">
                <span className="float-icon">{c.icon}</span>
                <span className="float-budget">{c.budget}</span>
              </div>
              <div className="float-title">{c.title}</div>
              <div className="float-brand">{c.brand}</div>
            </div>
          ))}
        </div>
        <div className="auth-right-copy">
          <h2>Manage every brand collab<br />in one place</h2>
          <p>Discover campaigns, send proposals and track payouts — all from CreatorHub.</p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.4 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.6 5.4C41.6 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 23 23">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

export default Login;
