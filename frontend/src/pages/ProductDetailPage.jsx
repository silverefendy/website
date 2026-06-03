import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { DEFAULT_PRODUCT_IMAGE, buildWhatsAppUrl, formatPrice, resolveImageUrl } from '../config/constants';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import StarRating from '../components/ui/StarRating';
import useAuthStore from '../stores/authStore';
import useCartStore from '../stores/cartStore';
import useProductStore from '../stores/productStore';
import useToastStore from '../stores/toastStore';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { currentProduct, isLoading, fetchProduct } = useProductStore();
  const { addItem } = useCartStore();
  const { isAuthenticated, isCustomer } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct(slug).catch(() => {});
  }, [fetchProduct, slug]);

  const images = useMemo(() => {
    const productImages = currentProduct?.images || currentProduct?.product_images || [];
    if (productImages.length > 0) return productImages.map((image) => image.image_path || image.path || image.url);
    return [currentProduct?.primary_image || currentProduct?.image_path || currentProduct?.image].filter(Boolean);
  }, [currentProduct]);

  useEffect(() => {
    if (images.length > 0) setSelectedImage(images[0]);
  }, [images]);

  useEffect(() => {
    setIsWishlisted(Boolean(currentProduct?.is_wishlisted));
  }, [currentProduct?.is_wishlisted]);

  const toggleWishlist = async () => {
    if (!isAuthenticated || !isCustomer) {
      useToastStore.getState().showToast('Please login as a customer to use your wishlist.', 'error');
      return;
    }

    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${currentProduct.id}`);
        setIsWishlisted(false);
        useToastStore.getState().showToast('Removed from wishlist.', 'success');
      } else {
        await api.post(`/wishlist/${currentProduct.id}`);
        setIsWishlisted(true);
        useToastStore.getState().showToast('Added to wishlist.', 'success');
      }
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to update wishlist.', 'error');
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();
    try {
      await api.post(`/products/${currentProduct.slug}/reviews`, review);
      useToastStore.getState().showToast('Review submitted successfully.', 'success');
      setReview({ rating: 5, comment: '' });
      fetchProduct(slug).catch(() => {});
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to submit review.', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!currentProduct) return <EmptyState title="Product not found" description="The product may have been removed or is unavailable." />;

  const stock = Number(currentProduct.stock || 0);
  const reviews = currentProduct.reviews || [];

  return (
    <div className="space-y-8">
      <section className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2 lg:p-8">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
            <img
              src={resolveImageUrl(selectedImage)}
              alt={currentProduct.name}
              onError={(event) => { event.currentTarget.src = DEFAULT_PRODUCT_IMAGE; }}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto">
            {images.map((image) => (
              <button key={image} type="button" onClick={() => setSelectedImage(image)} className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border ${selectedImage === image ? 'border-primary-600' : 'border-slate-200'}`}>
                <img src={resolveImageUrl(image)} alt={`${currentProduct.name} thumbnail`} onError={(event) => { event.currentTarget.src = DEFAULT_PRODUCT_IMAGE; }} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">{currentProduct.condition}</span>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">{currentProduct.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={currentProduct.average_rating} showCount count={currentProduct.review_count || reviews.length} />
              <span className="text-sm text-slate-500">{currentProduct.views || 0} views</span>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-primary-700">{formatPrice(currentProduct.price)}</p>
          <p className="text-sm text-slate-600">Stock: <span className="font-semibold text-slate-900">{stock}</span>{stock > 0 && stock <= 5 && <span className="ml-2 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">Low stock</span>}{stock === 0 && <span className="ml-2 rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-700">Out of stock</span>}</p>

          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Sold by</p>
            <Link to={`/stores/${currentProduct.store_slug || currentProduct.store_id}`} className="font-semibold text-primary-700">{currentProduct.store_name}</Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input type="number" min="1" max={stock || 1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="w-28 rounded-xl border border-slate-200 px-3 py-3" />
            <button type="button" disabled={!stock} onClick={() => addItem(currentProduct.id, quantity)} className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50">Add to Cart</button>
            <button type="button" onClick={toggleWishlist} className={`rounded-xl border px-6 py-3 font-semibold ${isWishlisted ? 'border-red-200 bg-red-50 text-red-700' : 'border-primary-200 text-primary-700 hover:bg-primary-50'}`}>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</button>
            <a href={buildWhatsAppUrl(`I want to ask about ${currentProduct.name}`)} target="_blank" rel="noreferrer" className="rounded-xl border border-primary-200 px-6 py-3 text-center font-semibold text-primary-700 hover:bg-primary-50">Contact Store</a>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:p-8">
        <div className="flex gap-3 border-b border-slate-200">
          {['description', 'reviews'].map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`border-b-2 px-4 py-3 text-sm font-semibold capitalize ${activeTab === tab ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500'}`}>{tab}</button>
          ))}
        </div>
        {activeTab === 'description' ? (
          <p className="mt-6 whitespace-pre-line leading-7 text-slate-700">{currentProduct.description || 'No description available.'}</p>
        ) : (
          <div className="mt-6 space-y-6">
            {reviews.length > 0 ? reviews.map((item) => (
              <article key={item.id} className="border-b border-slate-100 pb-4 last:border-0">
                <div className="flex items-center justify-between"><p className="font-semibold text-slate-900">{item.user_name || item.name}</p><StarRating rating={item.rating} /></div>
                <p className="mt-2 text-slate-600">{item.comment}</p>
              </article>
            )) : <EmptyState title="No reviews yet" description="Reviews from customers will appear here." />}

            {isAuthenticated && isCustomer && currentProduct.can_review && (
              <form onSubmit={submitReview} className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-950">Add a review</h3>
                <select value={review.rating} onChange={(event) => setReview((state) => ({ ...state, rating: Number(event.target.value) }))} className="mt-3 rounded-xl border px-3 py-2">
                  {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}
                </select>
                <textarea value={review.comment} onChange={(event) => setReview((state) => ({ ...state, comment: event.target.value }))} className="mt-3 w-full rounded-xl border px-3 py-2" rows="4" placeholder="Share your experience" />
                <button type="submit" className="mt-3 rounded-xl bg-primary-600 px-5 py-2.5 font-semibold text-white">Submit Review</button>
              </form>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetailPage;
