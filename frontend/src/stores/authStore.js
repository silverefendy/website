import { create } from 'zustand';
import api from '../api/axios';
import useToastStore from './toastStore';

const getResponseData = (response) => response.data?.data || response.data || {};
const getMessage = (error, fallback) => error.response?.data?.message || error.message || fallback;

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: localStorage.getItem('token') !== null,
  isAdmin: false,
  isSeller: false,
  isCustomer: false,

  setSession: ({ token, user }) => {
    if (token) {
      localStorage.setItem('token', token);
    }

    set({
      token: token || get().token,
      user,
      isAuthenticated: Boolean(token || get().token),
      isAdmin: user?.role_id === 1,
      isSeller: user?.role_id === 2,
      isCustomer: user?.role_id === 3,
    });
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', credentials);
      const data = getResponseData(response);
      get().setSession({ token: data.token, user: data.user });
      useToastStore.getState().showToast(response.data?.message || 'Login successful.', 'success');
      return data;
    } catch (error) {
      useToastStore.getState().showToast(getMessage(error, 'Unable to login.'), 'error');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/register', data);
      const payload = getResponseData(response);
      if (payload.token && payload.user) {
        get().setSession({ token: payload.token, user: payload.user });
      }
      useToastStore.getState().showToast(response.data?.message || 'Registration successful.', 'success');
      return payload;
    } catch (error) {
      useToastStore.getState().showToast(getMessage(error, 'Unable to register.'), 'error');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, token: null, isAuthenticated: false, isAdmin: false, isSeller: false, isCustomer: false });
    useToastStore.getState().showToast('You have been logged out.', 'success');
  },

  fetchMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isAdmin: false, isSeller: false, isCustomer: false });
      return null;
    }

    set({ isLoading: true, token, isAuthenticated: true });
    try {
      const response = await api.get('/auth/me');
      const data = getResponseData(response);
      const user = data.user || data;
      get().setSession({ token, user });
      return user;
    } catch (error) {
      localStorage.clear();
      set({ user: null, token: null, isAuthenticated: false, isAdmin: false, isSeller: false, isCustomer: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.put('/auth/profile', data);
      const payload = getResponseData(response);
      const user = payload.user || payload;
      get().setSession({ token: get().token, user });
      useToastStore.getState().showToast(response.data?.message || 'Profile updated successfully.', 'success');
      return user;
    } catch (error) {
      useToastStore.getState().showToast(getMessage(error, 'Unable to update profile.'), 'error');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
