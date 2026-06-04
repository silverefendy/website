import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useToastStore from '../../stores/toastStore';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', role_id: '', page: 1 });
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/users', { params: filters });
      const payload = response.data?.data || response.data || {};
      setUsers(payload.users || payload.items || []);
      setPagination(payload.pagination || { page: 1, totalPages: 1 });
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load users.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, [filters]);

  const update = (key, value) => setFilters((state) => ({ ...state, [key]: value, page: key === 'page' ? value : 1 }));

  const action = async (user, payload) => {
    try {
      await api.put(`/admin/users/${user.id}`, payload);
      useToastStore.getState().showToast('User updated.', 'success');
      loadUsers();
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to update user.', 'error');
    }
  };

  const disableSeller = (user) => action(user, { can_become_seller: false, seller_status: 'disabled' });
  const enableSeller = (user) => action(user, { can_become_seller: true, seller_status: 'eligible' });

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="space-y-5">
      <div className="rounded-2xl bg-white p-5 shadow-sm"><h1 className="text-2xl font-bold">Users</h1><div className="mt-4 flex flex-col gap-3 md:flex-row"><input value={filters.search} onChange={(event) => update('search', event.target.value)} placeholder="Search users" className="rounded-xl border px-4 py-2" /><select value={filters.role_id} onChange={(event) => update('role_id', event.target.value)} className="rounded-xl border px-4 py-2"><option value="">All roles</option><option value="1">Admin</option><option value="2">Seller</option><option value="3">Customer</option></select></div></div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm"><table className="min-w-full divide-y text-sm"><thead className="bg-slate-50 text-left"><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Account</th><th className="px-5 py-3">Seller</th><th className="px-5 py-3">Joined</th><th className="px-5 py-3">Actions</th></tr></thead><tbody className="divide-y">{users.map((user) => <tr key={user.id}><td className="px-5 py-3">{user.name}</td><td className="px-5 py-3">{user.email}</td><td className="px-5 py-3"><span className="rounded-full bg-primary-50 px-2 py-1 text-primary-700">{user.role || user.role_name}</span></td><td className="px-5 py-3">{user.is_active ? 'Active' : 'Banned'}</td><td className="px-5 py-3"><span className={user.seller_status === 'disabled' ? 'text-red-600' : 'text-emerald-700'}>{user.seller_status || 'eligible'}</span></td><td className="px-5 py-3">{new Date(user.created_at).toLocaleDateString()}</td><td className="space-x-3 px-5 py-3"><button onClick={() => action(user, { is_active: !user.is_active })} className="text-red-600">Toggle account</button>{user.seller_status === 'disabled' ? <button onClick={() => enableSeller(user)} className="text-emerald-700">Enable seller</button> : <button onClick={() => disableSeller(user)} className="text-amber-700">Disable seller</button>}<select onChange={(event) => event.target.value && action(user, { role_id: Number(event.target.value) })} className="rounded border px-2 py-1"><option value="">Change role</option><option value="1">Admin</option><option value="2">Seller</option><option value="3">Customer</option></select></td></tr>)}</tbody></table></div>
      <Pagination currentPage={pagination.page || filters.page} totalPages={pagination.totalPages || 1} onPageChange={(page) => update('page', page)} />
    </section>
  );
};

export default UserManagementPage;
