import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SITE_NAME, SITE_TAGLINE } from '../../config/constants';
import useAuthStore from '../../stores/authStore';
import useToastStore from '../../stores/toastStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = useMemo(() => (searchParams.get('role') === 'seller' ? 'seller' : 'customer'), [searchParams]);
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm_password: '', role: defaultRole, store_name: '', description: '' });

  const update = (key, value) => setForm((state) => ({ ...state, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirm_password) {
      useToastStore.getState().showToast('Password confirmation does not match.', 'error');
      return;
    }
    const payload = { name: form.name, email: form.email, password: form.password, role: form.role };
    if (form.role === 'seller') {
      payload.store_name = form.store_name;
      payload.description = form.description;
    }
    await register(payload);
    navigate(form.role === 'seller' ? '/seller' : '/', { replace: true });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link to="/" className="block text-center text-2xl font-bold text-primary-700">{SITE_NAME}</Link>
        <p className="mt-2 text-center text-sm text-slate-500">{SITE_TAGLINE}</p>
        <h1 className="mt-8 text-2xl font-bold text-slate-950">Create account</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Full name" className="w-full rounded-xl border px-4 py-3" />
          <input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="Email" className="w-full rounded-xl border px-4 py-3" />
          <div className="grid gap-3 sm:grid-cols-2"><input required type="password" value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="Password" className="rounded-xl border px-4 py-3" /><input required type="password" value={form.confirm_password} onChange={(event) => update('confirm_password', event.target.value)} placeholder="Confirm password" className="rounded-xl border px-4 py-3" /></div>
          <select value={form.role} onChange={(event) => update('role', event.target.value)} className="w-full rounded-xl border px-4 py-3"><option value="customer">Customer</option><option value="seller">Seller</option></select>
          {form.role === 'seller' && (
            <div className="space-y-3 rounded-2xl bg-primary-50 p-4">
              <input value={form.store_name} onChange={(event) => update('store_name', event.target.value)} placeholder="Store name" className="w-full rounded-xl border px-4 py-3" />
              <textarea value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Store description" rows="3" className="w-full rounded-xl border px-4 py-3" />
            </div>
          )}
          <button disabled={isLoading} type="submit" className="w-full rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-60">{isLoading ? 'Registering...' : 'Register'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-primary-700">Login</Link></p>
      </section>
    </main>
  );
};

export default RegisterPage;
