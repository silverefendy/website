import { create } from 'zustand';
import api from '../api/axios';
import useToastStore from './toastStore';

const defaultPagination = { page: 1, limit: 12, total: 0, totalPages: 1 };
const defaultFilters = { category: '', search: '', min_price: '', max_price: '', condition: '', sort: 'newest', page: 1 };
const messageFrom = (error, fallback) => error.response?.data?.message || fallback;

const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  pagination: defaultPagination,
  filters: defaultFilters,
  isLoading: false,

  fetchProducts: async (params = {}) => {
    set({ isLoading: true });
    try {
      const query = { ...get().filters, ...params };
      const response = await api.get('/products', { params: query });
      const payload = response.data?.data || response.data || {};
      const products = payload.products || payload.items || [];
      const pagination = payload.pagination || {
        page: Number(query.page || 1),
        limit: Number(query.limit || 12),
        total: Number(payload.total || products.length),
        totalPages: Number(payload.totalPages || payload.total_pages || 1),
      };

      set({ products, pagination, filters: query });
      return { products, pagination };
    } catch (error) {
      useToastStore.getState().showToast(messageFrom(error, 'Unable to load products.'), 'error');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProduct: async (slug) => {
    set({ isLoading: true, currentProduct: null });
    try {
      const response = await api.get(`/products/${slug}`);
      const payload = response.data?.data || response.data || {};
      const product = payload.product || payload;
      set({ currentProduct: product });
      return product;
    } catch (error) {
      useToastStore.getState().showToast(messageFrom(error, 'Unable to load product.'), 'error');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));

export default useProductStore;
