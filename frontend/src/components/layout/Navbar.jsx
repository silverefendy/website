import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { DEFAULT_AVATAR_IMAGE, SITE_NAME, resolveImageUrl } from '../../config/constants';
import useAuthStore from '../../stores/authStore';
import useCartStore from '../../stores/cartStore';
import useNotificationStore from '../../stores/notificationStore';

const Navbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const { user, isAuthenticated, isSeller, isCustomer, logout } = useAuthStore();
  const { totalItems, fetchCart } = useCartStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated) {
      if (isCustomer) fetchCart().catch(() => {});
      fetchNotifications().catch(() => {});
    }
  }, [fetchCart, fetchNotifications, isAuthenticated, isCustomer]);

  const submitSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    navigate(`/products${params.toString() ? `?${params}` : ''}`);
    setIsMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) => `text-sm font-medium ${isActive ? 'text-primary-700' : 'text-slate-600 hover:text-primary-700'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button type="button" className="rounded-lg p-2 text-slate-700 lg:hidden" onClick={() => setIsMobileOpen((value) => !value)} aria-label="Open menu">
          ☰
        </button>
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-600 font-bold text-white">{SITE_NAME?.charAt(0)}</span>
          <span className="hidden text-lg font-bold text-slate-950 sm:block">{SITE_NAME}</span>
        </Link>

        <form onSubmit={submitSearch} className="hidden flex-1 lg:block">
          <label className="sr-only" htmlFor="navbar-search">Search products</label>
          <input
            id="navbar-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </form>

        <nav className="hidden items-center gap-5 lg:flex">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/products" className={navLinkClass}>Products</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Login</Link>
              <Link to="/register" className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">Register</Link>
            </>
          ) : (
            <>
              {isCustomer && (
                <Link to="/cart" className="relative rounded-xl p-2 text-xl hover:bg-slate-100" aria-label="Cart">
                  🛒
                  {totalItems > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-primary-600 px-1.5 text-xs font-bold text-white">{totalItems}</span>}
                </Link>
              )}
              <button type="button" className="relative rounded-xl p-2 text-xl hover:bg-slate-100" aria-label="Notifications">
                🔔
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">{unreadCount}</span>}
              </button>
              <div className="relative">
                <button type="button" onClick={() => setIsUserOpen((value) => !value)} className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100">
                  <img
                    src={user?.avatar ? resolveImageUrl(user.avatar) : DEFAULT_AVATAR_IMAGE}
                    alt={user?.name || 'User avatar'}
                    onError={(event) => { event.currentTarget.src = DEFAULT_AVATAR_IMAGE; }}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <span className="hidden text-sm font-semibold text-slate-700 sm:block">{user?.name}</span>
                </button>
                {isUserOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <Link className="block rounded-xl px-4 py-2 text-sm hover:bg-slate-50" to="/profile">My Profile</Link>
                    <Link className="block rounded-xl px-4 py-2 text-sm hover:bg-slate-50" to="/orders">My Orders</Link>
                    {isCustomer && <Link className="block rounded-xl px-4 py-2 text-sm hover:bg-slate-50" to="/wishlist">Wishlist</Link>}
                    {isSeller && <Link className="block rounded-xl px-4 py-2 text-sm hover:bg-slate-50" to="/seller">Seller Dashboard</Link>}
                    <button type="button" onClick={() => { logout(); navigate('/'); }} className="block w-full rounded-xl px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isMobileOpen && (
        <div className="border-t border-slate-200 px-4 py-4 lg:hidden">
          <form onSubmit={submitSearch} className="mb-4">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="w-full rounded-xl border px-4 py-2.5 text-sm" />
          </form>
          <nav className="flex flex-col gap-3">
            <Link to="/" onClick={() => setIsMobileOpen(false)} className="font-medium text-slate-700">Home</Link>
            <Link to="/products" onClick={() => setIsMobileOpen(false)} className="font-medium text-slate-700">Products</Link>
            {isAuthenticated && <Link to="/orders" onClick={() => setIsMobileOpen(false)} className="font-medium text-slate-700">My Orders</Link>}
            {isAuthenticated && isCustomer && <Link to="/wishlist" onClick={() => setIsMobileOpen(false)} className="font-medium text-slate-700">Wishlist</Link>}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
