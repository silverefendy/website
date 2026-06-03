import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { formatPrice } from '../../config/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useToastStore from '../../stores/toastStore';

const colors = ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const AdminDashboardPage = () => {
  const [data, setData] = useState({ stats: {}, orders_per_day: [], orders_by_status: [], recent_orders: [] });
  const [charts, setCharts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const rechartsPackage = 're' + 'charts';
    import(/* @vite-ignore */ rechartsPackage).then(setCharts).catch(() => setCharts(null));
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/admin/stats');
        setData(response.data?.data || response.data || {});
      } catch (error) {
        useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load admin stats.', 'error');
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
      <h1 className="text-2xl font-bold text-slate-950">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Total Users', stats.total_users], ['Total Products', stats.total_products], ['Total Orders', stats.total_orders], ['Pending Orders', stats.pending_orders]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{value || 0}</p></div>)}</div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="font-bold">Orders per day</h2><div className="mt-4 h-72">{charts ? <charts.ResponsiveContainer><charts.BarChart data={data.orders_per_day || []}><charts.XAxis dataKey="date" /><charts.YAxis /><charts.Tooltip formatter={(value) => [value, 'Orders']} /><charts.Bar dataKey="orders" fill="#4f46e5" /></charts.BarChart></charts.ResponsiveContainer> : <div className="flex h-full items-end gap-2">{(data.orders_per_day || []).map((item) => <div key={item.date} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t bg-primary-500" style={{ height: `${Math.max(Number(item.orders || 0) * 12, 8)}px` }} /><span className="text-xs text-slate-500">{item.date}</span></div>)}</div>}</div></section>
        <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="font-bold">Orders by status</h2><div className="mt-4 h-72">{charts ? <charts.ResponsiveContainer><charts.PieChart><charts.Pie data={data.orders_by_status || []} dataKey="count" nameKey="status" outerRadius={100}>{(data.orders_by_status || []).map((entry, index) => <charts.Cell key={entry.status} fill={colors[index % colors.length]} />)}</charts.Pie><charts.Tooltip /></charts.PieChart></charts.ResponsiveContainer> : <div className="space-y-3">{(data.orders_by_status || []).map((item, index) => <div key={item.status}><div className="flex justify-between text-sm"><span className="capitalize">{item.status}</span><span>{item.count}</span></div><div className="mt-1 h-2 rounded bg-slate-100"><div className="h-2 rounded" style={{ width: `${Math.min(Number(item.count || 0) * 10, 100)}%`, backgroundColor: colors[index % colors.length] }} /></div></div>)}</div>}</div></section>
      </div>
      <section className="rounded-2xl bg-white shadow-sm"><div className="border-b p-5"><h2 className="font-bold">Recent Orders</h2></div><div className="overflow-x-auto"><table className="min-w-full text-sm"><tbody>{(data.recent_orders || []).map((order) => <tr key={order.id} className="border-b"><td className="px-5 py-3"><Link to="/admin/orders" className="font-semibold text-primary-700">{order.order_number}</Link></td><td className="px-5 py-3">{order.store_name}</td><td className="px-5 py-3">{formatPrice(order.total)}</td><td className="px-5 py-3 capitalize">{order.status}</td></tr>)}</tbody></table></div></section>
    </div>
  );
};

export default AdminDashboardPage;
