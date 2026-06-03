import { useEffect, useState } from 'react';
import api from '../../api/axios';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ProductCard from '../../components/ui/ProductCard';
import useToastStore from '../../stores/toastStore';

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/wishlist');
      const payload = response.data?.data || response.data || {};
      setItems(payload.products || payload.items || []);
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load wishlist.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadWishlist(); }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">My Wishlist</h1>
        <p className="mt-1 text-slate-600">Save products for later and jump back into product details when you are ready to buy.</p>
      </div>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {items.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : <EmptyState title="Your wishlist is empty" description="Tap Add to Wishlist on any product to save it here." />}
    </section>
  );
};

export default WishlistPage;
