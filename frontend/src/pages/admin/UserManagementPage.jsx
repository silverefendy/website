import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useToastStore from '../../stores/toastStore';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', role: '', page: 1 });
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/users', { params: filters });
      const payload = response.data?.data || response.data || {};
      setUsers(payload.users || payload.items || []);
      setPagination(payload.pagination || { page: filters.page, totalPages: 1 });
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load users.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, [filters]);
  const update = (key, value) => setFilters((state) => ({ ...state, [key]: value, page: key === 'page' ? value : 1 }));

  const action = async (user, payload) => {
    if (!window.confirm(`Update ${user.email}?`)) return;
    try {
      await api.put(`/admin/users/${user.id}`, payload);
      useToastStore.getState().showToast('User updated.', 'success');
      loadUsers();
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to update user.', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  return <section className="space-y-5"><h1 className="text-2xl font-bold">Users</h1><div className="grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-2"><input value={filters.search} onChange={(e) => update('search', e.target.value)} placeholder="Search name or email" className="rounded-xl border px-4 py-2" /><select value={filters.role} onChange={(e) => update('role', e.target.value)} className="rounded-xl border px-4 py-2"><option value="">All roles</option><option value="admin">Admin</option><option value="seller">Seller</option><option value="customer">Customer</option></select></div><div className="overflow-x-auto rounded-2xl bg-white shadow-sm"><table className="min-w-full divide-y text-sm"><thead className="bg-slate-50 text-left"><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Joined</th><th className="px-5 py-3">Actions</th></tr></thead><tbody className="divide-y">{users.map((user) => <tr key={user.id}><td className="px-5 py-3">{user.name}</td><td className="px-5 py-3">{user.email}</td><td className="px-5 py-3"><span className="rounded-full bg-primary-50 px-2 py-1 text-primary-700">{user.role || user.role_name}</span></td><td className="px-5 py-3">{user.is_active ? 'Active' : 'Banned'}</td><td className="px-5 py-3">{new Date(user.created_at).toLocaleDateString()}</td><td className="px-5 py-3"><button onClick={() => action(user, { is_active: !user.is_active })} className="mr-3 text-red-600">Toggle status</button><select onChange={(e) => e.target.value && action(user, { role_id: Number(e.target.value) })} className="rounded border px-2 py-1"><option value="">Change role</option><option value="1">Admin</option><option value="2">Seller</option><option value="3">Customer</option></select></td></tr>)}</tbody></table></div><Pagination currentPage={pagination.page || filters.page} totalPages={pagination.totalPages || 1} onPageChange={(page) => update('page', page)} /></section>;
};

export default UserManagementPage;
