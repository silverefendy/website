import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { SITE_NAME, SITE_TAGLINE } from '../config/constants';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import useToastStore from '../stores/toastStore';

const categoryIcons = ['📱', '👗', '🏠', '⚽', '✨', '🛍️', '🎧', '🍳'];

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      setIsLoading(true);
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          api.get('/categories'),
          api.get('/products', { params: { sort: 'newest', limit: 8 } }),
        ]);
        const categoryPayload = categoryResponse.data?.data || categoryResponse.data || {};
        const productPayload = productResponse.data?.data || productResponse.data || {};
        setCategories(categoryPayload.categories || categoryPayload.items || []);
        setFeaturedProducts(productPayload.products || productPayload.items || []);
      } catch (error) {
        useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load homepage data.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-14">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-500 px-6 py-16 text-white shadow-xl sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-100">Marketplace</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">{SITE_NAME}</h1>
          <p className="mt-5 text-lg leading-8 text-primary-50">{SITE_TAGLINE}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/products" className="rounded-xl bg-white px-6 py-3 text-center font-semibold text-primary-700 hover:bg-primary-50">Shop Products</Link>
            <Link to="/register?role=seller" className="rounded-xl border border-white/40 px-6 py-3 text-center font-semibold text-white hover:bg-white/10">Start Selling</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-950">Browse Categories</h2>
          <Link to="/products" className="text-sm font-semibold text-primary-700">View all</Link>
        </div>
        {isLoading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category, index) => (
              <Link key={category.id} to={`/products?category=${category.slug || category.id}`} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-md">
                <div className="text-3xl">{categoryIcons[index % categoryIcons.length]}</div>
                <p className="mt-3 font-semibold text-slate-900">{category.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-950">Featured Products</h2>
          <Link to="/products?sort=newest" className="text-sm font-semibold text-primary-700">See more</Link>
        </div>
        {isLoading ? <LoadingSpinner /> : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <EmptyState title="No featured products yet" description="Products will appear here when sellers publish them." />
        )}
      </section>

      <section className="rounded-3xl border border-primary-100 bg-primary-50 p-8 text-center sm:p-10">
        <h2 className="text-2xl font-bold text-slate-950">Ready to grow your business?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">Create a seller account and reach more customers with a storefront built for marketplace commerce.</p>
        <Link to="/register?role=seller" className="mt-6 inline-flex rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700">Register as Seller</Link>
      </section>
    </div>
  );
};

export default HomePage;
