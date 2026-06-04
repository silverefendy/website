import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ui/ProductCard';
import Pagination from '../components/ui/Pagination';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import useProductStore from '../stores/productStore';
import useToastStore from '../stores/toastStore';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, pagination, isLoading, fetchProducts, setFilter } = useProductStore();
  const [categories, setCategories] = useState([]);

  const queryState = useMemo(() => ({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    condition: searchParams.get('condition') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page') || 1),
  }), [searchParams]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get('/categories');
        const payload = response.data?.data || response.data || {};
        setCategories(payload.categories || payload.items || []);
      } catch (error) {
        useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load categories. Please confirm the local API is running.', 'error');
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    fetchProducts(queryState).catch(() => {});
  }, [fetchProducts, queryState]);

  const updateQuery = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set(key, value);
    else nextParams.delete(key);
    if (key !== 'page') nextParams.set('page', '1');
    setFilter(key, value);
    setSearchParams(nextParams);
  };

  const resultCount = pagination.total || products.length;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:h-fit">
        <h2 className="text-lg font-bold text-slate-950">Filters</h2>
        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Search</span>
            <input value={queryState.search} onChange={(event) => updateQuery('search', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Keyword" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Category</span>
            <select value={queryState.category} onChange={(event) => updateQuery('category', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="">All categories</option>
              {categories.map((category) => <option key={category.id} value={category.slug || category.id}>{category.name}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Min price</span>
              <input type="number" value={queryState.min_price} onChange={(event) => updateQuery('min_price', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Max price</span>
              <input type="number" value={queryState.max_price} onChange={(event) => updateQuery('max_price', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Condition</span>
            <select value={queryState.condition} onChange={(event) => updateQuery('condition', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="">Any</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </label>
        </div>
      </aside>

      <section>
        <div className="mb-5 flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">{resultCount}</span> products found</p>
          <select value={queryState.sort} onChange={(event) => updateQuery('sort', event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="newest">Newest</option>
            <option value="price_low">Price: low to high</option>
            <option value="price_high">Price: high to low</option>
            <option value="popular">Most popular</option>
          </select>
        </div>

        {isLoading ? <LoadingSpinner /> : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            <div className="mt-8">
              <Pagination currentPage={Number(pagination.page || queryState.page)} totalPages={Number(pagination.totalPages || 1)} onPageChange={(page) => updateQuery('page', String(page))} />
            </div>
          </>
        ) : (
          <EmptyState title="No products found" description="Try changing the filters or search keyword." actionLabel="Reset filters" onAction={() => setSearchParams({})} />
        )}
      </section>
    </div>
  );
};

export default ProductListPage;
