import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import { formatPrice } from '../../config/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useToastStore from '../../stores/toastStore';

const statuses = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const nextStatuses = { pending: 'confirmed', confirmed: 'processing', processing: 'shipped' };

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/seller/orders', { params: { status } });
      const payload = response.data?.data || response.data || {};
      setOrders(payload.orders || payload.items || []);
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load orders.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [status]);
  const filteredOrders = useMemo(() => (status ? orders.filter((order) => order.status === status) : orders), [orders, status]);

  const updateStatus = async (order, nextStatus) => {
    if (!window.confirm(`Update order ${order.order_number} to ${nextStatus}?`)) return;
    try {
      await api.put(`/seller/orders/${order.id}/status`, { status: nextStatus });
      useToastStore.getState().showToast('Order status updated.', 'success');
      loadOrders();
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to update order.', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-950">Seller Orders</h1>
      <div className="flex flex-wrap gap-2">{statuses.map((item) => <button key={item || 'all'} type="button" onClick={() => setStatus(item)} className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize ${status === item ? 'bg-primary-600 text-white' : 'bg-white text-slate-600'}`}>{item || 'All'}</button>)}</div>
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Items</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredOrders.map((order) => <tr key={order.id} className="align-top"><td className="px-5 py-3"><button className="font-semibold text-primary-700" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>{order.order_number}</button>{expandedId === order.id && <div className="mt-3 space-y-1 text-xs text-slate-500">{(order.items || []).map((item) => <p key={item.id}>{item.product_name} × {item.quantity}</p>)}</div>}</td><td className="px-5 py-3">{order.customer_name || order.user_name}<br /><span className="text-xs text-slate-500">{order.customer_email}</span></td><td className="px-5 py-3">{new Date(order.created_at).toLocaleDateString()}</td><td className="px-5 py-3">{order.items_count || order.items?.length || 0}</td><td className="px-5 py-3">{formatPrice(order.total)}</td><td className="px-5 py-3 capitalize">{order.status}</td><td className="px-5 py-3">{nextStatuses[order.status] ? <button onClick={() => updateStatus(order, nextStatuses[order.status])} className="rounded-lg bg-primary-600 px-3 py-2 text-white">Move to {nextStatuses[order.status]}</button> : '-'}</td></tr>)}</tbody></table>
      </div>
    </section>
  );
};

export default SellerOrdersPage;
