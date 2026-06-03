import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { formatPrice } from '../../config/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useToastStore from '../../stores/toastStore';

const maskName = (name = '') => (name.length <= 2 ? `${name[0] || '*'}*` : `${name.slice(0, 1)}***${name.slice(-1)}`);

const SellerDashboardPage = () => {
  const [data, setData] = useState({ stats: {}, recent_orders: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/seller/dashboard');
        setData(response.data?.data || response.data || { stats: {}, recent_orders: [] });
      } catch (error) {
        useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load seller dashboard.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  const stats = data.stats || {};
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-950">Seller Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[['Total Products', stats.total_products || 0], ['Total Orders', stats.total_orders || 0], ['Pending Orders', stats.pending_orders || 0], ['Total Revenue', formatPrice(stats.total_revenue || 0)]].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-950">{value}</p></div>
        ))}
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5"><h2 className="font-bold text-slate-950">Recent Orders</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-slate-500"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {(data.recent_orders || []).map((order) => <tr key={order.id}><td className="px-5 py-3 font-semibold">{order.order_number}</td><td className="px-5 py-3">{maskName(order.customer_name)}</td><td className="px-5 py-3">{new Date(order.created_at).toLocaleDateString()}</td><td className="px-5 py-3">{formatPrice(order.total)}</td><td className="px-5 py-3 capitalize">{order.status}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SellerDashboardPage;
