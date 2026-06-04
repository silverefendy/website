import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { formatPrice } from '../../config/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useToastStore from '../../stores/toastStore';
import SafeImage from '../../components/ui/SafeImage';

const MyProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/seller/products', { params: { search, status } });
      const payload = response.data?.data || response.data || {};
      setProducts(payload.products || payload.items || []);
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load products.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);
  const filteredProducts = useMemo(() => products.filter((product) => (!search || product.name?.toLowerCase().includes(search.toLowerCase())) && (!status || product.status === status)), [products, search, status]);

  const toggleDelete = async (product) => {
    if (!window.confirm(`Change status for ${product.name}?`)) return;
    try {
      await api.put(`/products/${product.id}`, { status: product.status === 'deleted' ? 'inactive' : 'deleted' });
      useToastStore.getState().showToast('Product status updated.', 'success');
      loadProducts();
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to update product.', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><h1 className="text-2xl font-bold text-slate-950">My Products</h1><Link to="/seller/products/add" className="rounded-xl bg-primary-600 px-5 py-3 text-center font-semibold text-white">Add Product</Link></div>
      <div className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-2"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="rounded-xl border px-4 py-2" /><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border px-4 py-2"><option value="">All status</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="deleted">Deleted</option></select></div>
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredProducts.map((product) => <tr key={product.id}><td className="px-5 py-3"><div className="flex items-center gap-3"><SafeImage src={product.primary_image} alt={product.name} className="h-12 w-12 rounded-lg object-cover" /><span className="font-semibold">{product.name}</span></div></td><td className="px-5 py-3">{formatPrice(product.price)}</td><td className="px-5 py-3">{product.stock}</td><td className="px-5 py-3 capitalize">{product.status}</td><td className="px-5 py-3"><button onClick={() => navigate(`/seller/products/edit/${product.id}`)} className="mr-3 font-semibold text-primary-700">Edit</button><button onClick={() => toggleDelete(product)} className="font-semibold text-red-600">Delete toggle</button></td></tr>)}</tbody></table>
      </div>
    </section>
  );
};

export default MyProductsPage;
