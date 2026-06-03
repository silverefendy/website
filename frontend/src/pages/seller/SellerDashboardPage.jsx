import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
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
  const monthlySales = data.monthly_sales || [];
  const topProducts = data.top_selling_products || [];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-950">Seller Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[['Total Products', stats.total_products || 0], ['Total Orders', stats.total_orders || 0], ['Low Stock', stats.low_stock_products || 0], ['Total Sales', formatPrice(stats.total_sales || stats.total_revenue || 0)]].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-950">{value}</p></div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-950">Monthly Sales</h2>
          <div className="mt-4 flex h-72 items-end gap-3 rounded-xl bg-slate-50 p-4">
            {monthlySales.length > 0 ? monthlySales.map((item) => {
              const maxSales = Math.max(...monthlySales.map((entry) => Number(entry.sales || 0)), 1);
              const height = Math.max((Number(item.sales || 0) / maxSales) * 100, 8);
              return (
                <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div className="text-xs font-semibold text-slate-600">{formatPrice(item.sales)}</div>
                  <div className="w-full rounded-t-lg bg-primary-600" style={{ height: `${height}%` }} title={`${item.month}: ${formatPrice(item.sales)}`} />
                  <div className="text-xs text-slate-500">{item.month}</div>
                </div>
              );
            }) : <p className="self-center text-sm text-slate-500">No sales data yet.</p>}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-950">Top Selling Products</h2>
          <div className="mt-4 space-y-3">
            {topProducts.length > 0 ? topProducts.map((product) => (
              <div key={`${product.product_id}-${product.name}`} className="rounded-xl bg-slate-50 p-3">
                <div className="flex justify-between gap-3 text-sm"><span className="font-semibold text-slate-900">{product.name}</span><span>{product.quantity_sold} sold</span></div>
                <p className="mt-1 text-sm font-bold text-primary-700">{formatPrice(product.sales)}</p>
              </div>
            )) : <p className="text-sm text-slate-500">No sales yet.</p>}
          </div>
        </section>
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
