import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SITE_NAME } from '../../config/constants';
import useAuthStore from '../../stores/authStore';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'All Orders' },
  { to: '/admin/settings', label: 'Site Settings' },
];

const AdminLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const doLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className={`${open ? 'block' : 'hidden'} fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 p-5 text-white shadow-xl lg:static lg:block lg:w-auto`}>
        <Link to="/" className="text-xl font-bold text-white">{SITE_NAME}</Link>
        <p className="mt-1 text-sm text-slate-400">Admin Panel</p>
        <nav className="mt-8 space-y-2">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/admin'} onClick={() => setOpen(false)} className={({ isActive }) => `block rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-primary-500 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
              {link.label}
            </NavLink>
          ))}
          <button type="button" onClick={doLogout} className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-300 hover:bg-red-950/40">Logout</button>
        </nav>
      </aside>
      {open && <button type="button" aria-label="Close sidebar" className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <button type="button" className="rounded-lg border px-3 py-2 lg:hidden" onClick={() => setOpen(true)}>☰</button>
          <h1 className="font-bold text-slate-950">Admin</h1>
          <button type="button" onClick={doLogout} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Logout</button>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
