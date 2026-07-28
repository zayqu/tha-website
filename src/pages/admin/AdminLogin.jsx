import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiUrl } from '../../lib/api';

export default function AdminLogin() {
  const { login, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) navigate(from, { replace: true });
  }, [admin, from, navigate]);

  function update(field, value) {
    setForm(current => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const response = await fetch(apiUrl('/api/auth/register'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.errors?.[0]?.msg || data.error || 'Registration failed');
        }
        setNotice(data.message);
        setMode('login');
        setForm(current => ({ ...current, name: '', password: '' }));
      } else {
        await login(form.email.trim(), form.password);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">health_and_safety</span>
          </div>
          <h1 className="text-2xl font-bold text-white">THA Content Administration</h1>
          <p className="text-white/70 text-sm mt-1">Institutional news and public-health information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-7 sm:p-8">
          <div className="grid grid-cols-2 bg-gray-100 rounded-xl p-1 mb-6" aria-label="Account access options">
            {[
              ['login', 'Sign in'],
              ['register', 'Request access'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => { setMode(value); setError(''); setNotice(''); }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  mode === value ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-1">
            {mode === 'login' ? 'Sign in to your account' : 'Request an editor account'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'login'
              ? 'Only approved accounts can access the dashboard.'
              : 'Your account will remain pending until an administrator approves it.'}
          </p>

          {notice && <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</div>}
          {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <form onSubmit={submit} className="space-y-5">
            {mode === 'register' && (
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={event => update('name', event.target.value)}
                  autoComplete="name"
                  required
                  maxLength={100}
                  className={inputClass}
                  placeholder="Your full name"
                />
              </label>
            )}

            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</span>
              <input
                type="email"
                value={form.email}
                onChange={event => update('email', event.target.value)}
                autoComplete="email"
                required
                maxLength={100}
                className={inputClass}
                placeholder="name@example.org"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-1.5">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={event => update('password', event.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  minLength={mode === 'register' ? 12 : undefined}
                  maxLength={128}
                  className={`${inputClass} pr-12`}
                  placeholder="At least 12 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(value => !value)}
                  className="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Submit for approval'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/60 text-xs mt-6">
          Accounts are reviewed before access is granted.
        </p>
      </div>
    </div>
  );
}
