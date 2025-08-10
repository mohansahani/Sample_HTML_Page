import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 card">
      <h1 className="text-xl font-semibold mb-4">Sign In</h1>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="input" value={email} onChange={e => setEmail(e.target.value)} required type="email"/>
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input className="input" value={password} onChange={e => setPassword(e.target.value)} required type="password"/>
        </div>
        <button className="btn w-full" disabled={busy}>{busy ? 'Signing in...' : 'Login'}</button>
      </form>
    </div>
  );
}