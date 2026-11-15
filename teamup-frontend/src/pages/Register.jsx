import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell, { AuthLink } from '../components/AuthShell.jsx';
import { Alert, Button, Field } from '../components/ui.jsx';
import { api, getErrorMessage } from '../services/api.js';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.register(form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes a few seconds."
      footer={
        <>
          Already registered? <AuthLink to="/login">Log in</AuthLink>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>

        <Field
          id="name"
          label="Name"
          required
          autoComplete="name"
          value={form.name}
          onChange={set('name')}
          placeholder="Enter your full name"
        />

        <Field
          id="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={set('email')}
          placeholder="Enter your email"
        />

        <Field
          id="password"
          label="Password"
          type="password"
          required
          autoComplete="new-password"
          value={form.password}
          onChange={set('password')}
          placeholder="Enter your password"
        />

        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}