import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { buildWhatsAppUrl, formatPrice } from '../../config/constants';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useToastStore from '../../stores/toastStore';

const statusClasses = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-indigo-50 text-indigo-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/orders');
      const payload = response.data?.data || response.data || {};
      setOrders(payload.orders || payload.items || []);
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load orders.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const confirmReceipt = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/confirm-receipt`);
      useToastStore.getState().showToast('Receipt confirmed successfully.', 'success');
      loadOrders();
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to confirm receipt.', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (orders.length === 0) return <EmptyState title="No orders yet" description="Your orders will appear after checkout." />;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-950">My Orders</h1>
      {orders.map((order) => {
        const itemCount = order.items_count || order.items?.length || 0;
        return (
          <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <button type="button" onClick={() => setExpandedId((value) => (value === order.id ? null : order.id))} className="grid w-full gap-3 text-left md:grid-cols-[1fr_auto_auto_auto] md:items-center">
              <div><p className="font-bold text-slate-950">{order.order_number}</p><p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p></div>
              <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClasses[order.status] || 'bg-slate-100 text-slate-700'}`}>{order.status}</span>
              <span className="font-semibold text-slate-700">{itemCount} items</span>
              <span className="font-bold text-primary-700">{formatPrice(order.total)}</span>
            </button>
            {expandedId === order.id && (
              <div className="mt-5 border-t border-slate-100 pt-5">
                <div className="space-y-3">
                  {(order.items || []).map((item) => <div key={item.id} className="flex justify-between text-sm"><span>{item.product_name} × {item.quantity}</span><span>{formatPrice(item.subtotal)}</span></div>)}
                </div>
                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><p>{order.shipping_address}</p><p>{order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}</p></div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {order.status === 'shipped' && <button type="button" onClick={() => confirmReceipt(order.id)} className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">Confirm Receipt</button>}
                  <a href={order.whatsapp_url || buildWhatsAppUrl(`I want to ask about order ${order.order_number}`)} target="_blank" rel="noreferrer" className="rounded-xl border border-primary-200 px-4 py-2 font-semibold text-primary-700">Chat Seller via WhatsApp</a>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
};

export default MyOrdersPage;
