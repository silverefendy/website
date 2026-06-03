import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { DEFAULT_PRODUCT_IMAGE, buildWhatsAppUrl, formatPrice, resolveImageUrl } from '../config/constants';
import useCartStore from '../stores/cartStore';
import useToastStore from '../stores/toastStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, isLoading, fetchCart, updateItem, removeItem } = useCartStore();
  const [selectedItems, setSelectedItems] = useState([]);
  const [shipping, setShipping] = useState({ address: '', city: '', province: '', postal_code: '', notes: '' });

  useEffect(() => {
    fetchCart().catch(() => {});
  }, [fetchCart]);

  useEffect(() => {
    setSelectedItems(items.map((item) => item.id));
  }, [items]);

  const selectedCartItems = useMemo(() => items.filter((item) => selectedItems.includes(item.id)), [items, selectedItems]);
  const subtotal = selectedCartItems.reduce((sum, item) => sum + Number(item.price || item.product_price || item.product?.price || 0) * Number(item.quantity || 0), 0);

  const toggleItem = (id) => {
    setSelectedItems((state) => (state.includes(id) ? state.filter((itemId) => itemId !== id) : [...state, id]));
  };

  const checkout = async (event) => {
    event.preventDefault();
    if (selectedCartItems.length === 0) {
      useToastStore.getState().showToast('Select at least one cart item.', 'error');
      return;
    }

    try {
      const response = await api.post('/orders', {
        item_ids: selectedItems,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_province: shipping.province,
        shipping_postal_code: shipping.postal_code,
        notes: shipping.notes,
      });
      const payload = response.data?.data || response.data || {};
      useToastStore.getState().showToast(response.data?.message || 'Order created successfully.', 'success');
      window.location.assign(payload.whatsapp_url || buildWhatsAppUrl(`Order ${payload.order?.order_number || ''} has been created.`));
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to checkout.', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (items.length === 0) return <EmptyState title="Your cart is empty" description="Add products to your cart before checkout." actionLabel="Browse products" onAction={() => navigate('/products')} />;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <section className="space-y-4">
        {items.map((item) => {
          const price = Number(item.price || item.product_price || item.product?.price || 0);
          const image = item.primary_image || item.image_path || item.product?.primary_image;
          return (
            <article key={item.id} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[auto_96px_1fr_auto] sm:items-center">
              <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleItem(item.id)} className="h-5 w-5 rounded border-slate-300 text-primary-600" />
              <img src={resolveImageUrl(image)} alt={item.name || item.product?.name} onError={(event) => { event.currentTarget.src = DEFAULT_PRODUCT_IMAGE; }} className="h-24 w-24 rounded-xl object-cover" />
              <div>
                <h2 className="font-semibold text-slate-950">{item.name || item.product?.name}</h2>
                <p className="mt-1 font-bold text-primary-700">{formatPrice(price)}</p>
                <input type="number" min="1" value={item.quantity} onChange={(event) => updateItem(item.id, Number(event.target.value))} className="mt-3 w-24 rounded-lg border px-3 py-2" />
              </div>
              <button type="button" onClick={() => removeItem(item.id)} className="rounded-xl px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Remove</button>
            </article>
          );
        })}
      </section>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Checkout Summary</h2>
        <div className="mt-4 flex justify-between border-b border-slate-100 pb-4"><span>Subtotal</span><span className="font-bold">{formatPrice(subtotal)}</span></div>
        <p className="mt-3 text-sm text-slate-500">Shipping cost is calculated after the seller confirms your order.</p>
        <form onSubmit={checkout} className="mt-5 space-y-3">
          <textarea required value={shipping.address} onChange={(event) => setShipping((state) => ({ ...state, address: event.target.value }))} placeholder="Shipping address" className="w-full rounded-xl border px-3 py-2" rows="3" />
          <div className="grid grid-cols-2 gap-3">
            <input required value={shipping.city} onChange={(event) => setShipping((state) => ({ ...state, city: event.target.value }))} placeholder="City" className="rounded-xl border px-3 py-2" />
            <input required value={shipping.province} onChange={(event) => setShipping((state) => ({ ...state, province: event.target.value }))} placeholder="Province" className="rounded-xl border px-3 py-2" />
          </div>
          <input required value={shipping.postal_code} onChange={(event) => setShipping((state) => ({ ...state, postal_code: event.target.value }))} placeholder="Postal code" className="w-full rounded-xl border px-3 py-2" />
          <textarea value={shipping.notes} onChange={(event) => setShipping((state) => ({ ...state, notes: event.target.value }))} placeholder="Order notes" className="w-full rounded-xl border px-3 py-2" rows="2" />
          <button type="submit" className="w-full rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white hover:bg-primary-700">Checkout</button>
        </form>
      </aside>
    </div>
  );
};

export default CartPage;
