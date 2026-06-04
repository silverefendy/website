import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { formatPrice } from '../../config/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SafeImage from '../../components/ui/SafeImage';
import useToastStore from '../../stores/toastStore';
import SafeImage from '../../components/ui/SafeImage';

const MyProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stockForm, setStockForm] = useState({ product: null, movement_type: 'ADJUSTMENT', quantity: '', reason: '' });

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

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !status || product.status === status;
    return matchesSearch && matchesStatus;
  }), [products, search, status]);

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}? This will archive it from your store.`)) return;
    try {
      await api.delete(`/products/${product.id}`);
      useToastStore.getState().showToast('Product deleted.', 'success');
      loadProducts();
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to delete product.', 'error');
    }
  };

  const adjustStock = async (event) => {
    event.preventDefault();
    if (!stockForm.product) return;
    try {
      await api.post(`/products/${stockForm.product.id}/stock`, {
        movement_type: stockForm.movement_type,
        quantity: Number(stockForm.quantity),
        reason: stockForm.reason,
      });
      useToastStore.getState().showToast('Stock adjusted.', 'success');
      setStockForm({ product: null, movement_type: 'ADJUSTMENT', quantity: '', reason: '' });
      loadProducts();
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to adjust stock.', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">My Products</h1>
          <p className="text-sm text-slate-500">Manage product status, stock, and listings.</p>
        </div>
        <Link to="/seller/products/add" className="rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white">Add Product</Link>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="rounded-xl border px-4 py-2 md:w-80" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border px-4 py-2">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {stockForm.product && (
        <form onSubmit={adjustStock} className="grid gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-4 md:grid-cols-4 md:items-end">
          <div><p className="text-sm font-semibold">Adjust stock</p><p className="text-sm text-slate-600">{stockForm.product.name}</p></div>
          <label><span className="text-sm font-semibold">Type</span><select value={stockForm.movement_type} onChange={(event) => setStockForm((state) => ({ ...state, movement_type: event.target.value }))} className="mt-1 w-full rounded-xl border px-3 py-2"><option value="IN">IN</option><option value="OUT">OUT</option><option value="ADJUSTMENT">ADJUSTMENT</option></select></label>
          <label><span className="text-sm font-semibold">Quantity / new stock</span><input required type="number" min="0" value={stockForm.quantity} onChange={(event) => setStockForm((state) => ({ ...state, quantity: event.target.value }))} className="mt-1 w-full rounded-xl border px-3 py-2" /></label>
          <label><span className="text-sm font-semibold">Reason</span><input required value={stockForm.reason} onChange={(event) => setStockForm((state) => ({ ...state, reason: event.target.value }))} className="mt-1 w-full rounded-xl border px-3 py-2" /></label>
          <div className="flex gap-2 md:col-span-4"><button className="rounded-xl bg-primary-600 px-4 py-2 font-semibold text-white">Save stock</button><button type="button" onClick={() => setStockForm({ product: null, movement_type: 'ADJUSTMENT', quantity: '', reason: '' })} className="rounded-xl px-4 py-2 font-semibold">Cancel</button></div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-5 py-3"><div className="flex items-center gap-3"><SafeImage src={product.primary_image} alt={product.name} className="h-12 w-12 rounded-lg object-cover" /><span className="font-semibold">{product.name}</span></div></td>
                <td className="px-5 py-3">{formatPrice(product.price)}</td>
                <td className="px-5 py-3">{product.stock}</td>
                <td className="px-5 py-3 capitalize">{product.status}</td>
                <td className="space-x-3 px-5 py-3"><button onClick={() => navigate(`/seller/products/edit/${product.id}`)} className="font-semibold text-primary-700">Edit</button><button onClick={() => setStockForm({ product, movement_type: 'ADJUSTMENT', quantity: product.stock, reason: '' })} className="font-semibold text-emerald-700">Stock</button><button onClick={() => deleteProduct(product)} className="font-semibold text-red-600">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MyProductsPage;
