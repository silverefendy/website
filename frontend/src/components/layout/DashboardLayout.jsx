import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SITE_NAME } from '../../config/constants';
import useAuthStore from '../../stores/authStore';

const links = [
  { to: '/seller', label: 'Dashboard' },
  { to: '/seller/products', label: 'My Products' },
  { to: '/seller/products/add', label: 'Add Product' },
  { to: '/seller/orders', label: 'Orders' },
  { to: '/seller/store', label: 'Store Profile' },
];

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const storeName = user?.store?.store_name || user?.name || SITE_NAME;

  const doLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className={`${open ? 'block' : 'hidden'} fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-5 shadow-xl lg:static lg:block lg:w-auto lg:shadow-none`}>
        <Link to="/" className="text-xl font-bold text-primary-700">{SITE_NAME}</Link>
        <p className="mt-1 text-sm text-slate-500">Seller Center</p>
        <nav className="mt-8 space-y-2">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/seller'} onClick={() => setOpen(false)} className={({ isActive }) => `block rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {open && <button type="button" aria-label="Close sidebar" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-lg border px-3 py-2 lg:hidden" onClick={() => setOpen(true)}>☰</button>
            <div>
              <p className="text-sm text-slate-500">Store</p>
              <h1 className="font-bold text-slate-950">{storeName}</h1>
            </div>
          </div>
          <button type="button" onClick={doLogout} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Logout</button>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
