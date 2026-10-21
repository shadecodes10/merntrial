import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'creator', brandName: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="form-card">
      <h1 className="page-title" style={{ textAlign: 'center' }}>Create your account</h1>
      <p className="page-sub" style={{ textAlign: 'center' }}>Pick the role that matches who you are.</p>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />

        <label>I am a...</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="creator">Creator</option>
          <option value="brand">Brand Representative</option>
          <option value="talent">Talent Manager</option>
          <option value="finance">Finance Manager</option>
        </select>

        {form.role === 'brand' && (
          <>
            <label>Brand Name</label>
            <input name="brandName" value={form.brandName} onChange={handleChange} placeholder="Nike" />
          </>
        )}

        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Account</button>
      </form>
      <p className="muted" style={{ textAlign: 'center', marginTop: 14 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Register;
