
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthShell, { AuthLink } from '../components/AuthShell.jsx';
import { Alert, Button, Field } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/app" replace />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await login(form); navigate(location.state?.from?.pathname || '/app', { replace: true }); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to see your hackathons and teams."
      footer={<>New here? <AuthLink to="/register">Create an account</AuthLink></>}>
      <form onSubmit={submit} className="space-y-4">
        <Alert type="success">{location.state?.registered && 'Account created. Log in to continue.'}</Alert>
        <Alert>{error}</Alert>
        <Field id="email" label="Email" type="email" required autoComplete="email" value={form.email} onChange={set('email')} placeholder="Enter your email" />
        <Field id="password" label="Password" type="password" required autoComplete="current-password" value={form.password} onChange={set('password')} placeholder="Enter your password" />
        <Button type="submit" loading={loading} className="w-full">Log in</Button>
      </form>
    </AuthShell>
  );
}