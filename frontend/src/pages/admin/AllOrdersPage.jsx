import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import { formatPrice } from '../../config/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useToastStore from '../../stores/toastStore';

const AllOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [filters, setFilters] = useState({ status: '', date_from: '', date_to: '', store: '' });
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/orders', { params: filters });
      const payload = response.data?.data || response.data || {};
      setOrders(payload.orders || payload.items || []);
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load orders.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => { load(); }, [filters]);
  const visibleOrders = useMemo(() => orders.filter((order) => !filters.store || order.store_name?.toLowerCase().includes(filters.store.toLowerCase())), [orders, filters.store]);
  const update = (key, value) => setFilters((state) => ({ ...state, [key]: value }));
  const exportCsv = () => {
    const headers = ['order_number', 'store_name', 'customer_name', 'status', 'total'];
    const rows = visibleOrders.map((order) => headers.map((key) => JSON.stringify(order[key] ?? '')).join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.csv';
    link.click();
    URL.revokeObjectURL(url);
  };
  const updateStatus = async (order, status) => {
    if (!window.confirm(`Update order ${order.order_number} to ${status}?`)) return;
    try { await api.put(`/admin/orders/${order.id}/status`, { status }); useToastStore.getState().showToast('Order status updated.', 'success'); load(); } catch (error) { useToastStore.getState().showToast(error.response?.data?.message || 'Unable to update order.', 'error'); }
  };

  if (isLoading) return <LoadingSpinner />;
  return <section className="space-y-5"><div className="flex justify-between gap-3"><h1 className="text-2xl font-bold">All Orders</h1><button onClick={exportCsv} className="rounded-xl bg-slate-950 px-4 py-2 text-white">Export CSV</button></div><div className="grid gap-3 rounded-2xl bg-white p-4 md:grid-cols-4"><select value={filters.status} onChange={(e) => update('status', e.target.value)} className="rounded-xl border px-3 py-2"><option value="">All status</option>{['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}</select><input type="date" value={filters.date_from} onChange={(e) => update('date_from', e.target.value)} className="rounded-xl border px-3 py-2" /><input type="date" value={filters.date_to} onChange={(e) => update('date_to', e.target.value)} className="rounded-xl border px-3 py-2" /><input value={filters.store} onChange={(e) => update('store', e.target.value)} placeholder="Store name" className="rounded-xl border px-3 py-2" /></div><div className="overflow-x-auto rounded-2xl bg-white shadow-sm"><table className="min-w-full text-sm"><tbody>{visibleOrders.map((order) => <tr key={order.id} className="border-b align-top"><td className="px-5 py-3"><button className="font-semibold text-primary-700" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>{order.order_number}</button>{expandedId === order.id && <div className="mt-2 text-xs text-slate-500">{(order.items || []).map((item) => <p key={item.id}>{item.product_name} × {item.quantity}</p>)}</div>}</td><td className="px-5 py-3">{order.store_name}</td><td className="px-5 py-3">{order.customer_name}</td><td className="px-5 py-3">{formatPrice(order.total)}</td><td className="px-5 py-3 capitalize">{order.status}</td><td className="px-5 py-3"><select value="" onChange={(e) => e.target.value && updateStatus(order, e.target.value)} className="rounded border px-2 py-1"><option value="">Update</option>{['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div></section>;
};

export default AllOrdersPage;
