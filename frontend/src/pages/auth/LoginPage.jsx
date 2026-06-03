import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SITE_NAME, SITE_TAGLINE } from '../../config/constants';
import useAuthStore from '../../stores/authStore';

const roleRedirects = { 1: '/admin', 2: '/seller', 3: '/' };

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async (event) => {
    event.preventDefault();
    const data = await login(form);
    const destination = location.state?.from?.pathname || roleRedirects[data.user?.role_id] || '/';
    navigate(destination, { replace: true });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link to="/" className="block text-center text-2xl font-bold text-primary-700">{SITE_NAME}</Link>
        <p className="mt-2 text-center text-sm text-slate-500">{SITE_TAGLINE}</p>
        <h1 className="mt-8 text-2xl font-bold text-slate-950">Login</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block"><span className="text-sm font-semibold text-slate-700">Email</span><input required type="email" value={form.email} onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
          <label className="block"><span className="text-sm font-semibold text-slate-700">Password</span><div className="mt-2 flex rounded-xl border border-slate-200"><input required type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => setForm((state) => ({ ...state, password: event.target.value }))} className="min-w-0 flex-1 rounded-l-xl px-4 py-3 outline-none" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="px-4 text-sm font-semibold text-primary-700">{showPassword ? 'Hide' : 'Show'}</button></div></label>
          <button disabled={isLoading} type="submit" className="w-full rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-60">{isLoading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">No account? <Link to="/register" className="font-semibold text-primary-700">Register</Link></p>
      </section>
    </main>
  );
};

export default LoginPage;
