import { create } from 'zustand';
import api from '../api/axios';
import useToastStore from './toastStore';

const extractItems = (response) => response.data?.data?.items || response.data?.items || [];
const messageFrom = (error, fallback) => error.response?.data?.message || error.message || fallback;

const calculateTotals = (items) => ({
  totalItems: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
  totalPrice: items.reduce((sum, item) => sum + Number(item.price || item.product_price || item.product?.price || 0) * Number(item.quantity || 0), 0),
});

const useCartStore = create((set) => ({
  items: [],
  isLoading: false,
  totalItems: 0,
  totalPrice: 0,

  setItems: (items) => set({ items, ...calculateTotals(items) }),

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/cart');
      const items = extractItems(response);
      set({ items, ...calculateTotals(items) });
      return items;
    } catch (error) {
      useToastStore.getState().showToast(messageFrom(error, 'Unable to load cart.'), 'error');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/cart/items', { product_id: productId, quantity });
      const items = extractItems(response);
      set({ items, ...calculateTotals(items) });
      useToastStore.getState().showToast(response.data?.message || 'Product added to cart.', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast(messageFrom(error, 'Unable to add item.'), 'error');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      const items = extractItems(response);
      set({ items, ...calculateTotals(items) });
      useToastStore.getState().showToast(response.data?.message || 'Cart updated.', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast(messageFrom(error, 'Unable to update item.'), 'error');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true });
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      const items = extractItems(response);
      set({ items, ...calculateTotals(items) });
      useToastStore.getState().showToast(response.data?.message || 'Item removed.', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast(messageFrom(error, 'Unable to remove item.'), 'error');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      const response = await api.delete('/cart');
      set({ items: [], totalItems: 0, totalPrice: 0 });
      useToastStore.getState().showToast(response.data?.message || 'Cart cleared.', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast(messageFrom(error, 'Unable to clear cart.'), 'error');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useCartStore;
