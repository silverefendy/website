import { create } from 'zustand';
import api from '../api/axios';
import { clearAuthSession, getAccessToken, getRefreshToken, hasRefreshSession, setAuthSession } from '../utils/authSession';
import useToastStore from './toastStore';

const getResponseData = (response) => response.data?.data || response.data || {};
const getMessage = (error, fallback) => error.response?.data?.message || error.message || fallback;

const emptySession = { user: null, token: null, isAuthenticated: false, isAdmin: false, isSeller: false, isCustomer: false };

const useAuthStore = create((set, get) => ({
  user: null,
  token: getAccessToken(),
  isLoading: false,
  isAuthenticated: Boolean(getAccessToken() || getRefreshToken()),
  isAdmin: false,
  isSeller: false,
  isCustomer: false,

  setSession: ({ token, accessToken, refreshToken, user }) => {
    setAuthSession({ token, accessToken, refreshToken });
    const resolvedToken = accessToken || token || getAccessToken();

    set({
      token: resolvedToken,
      user,
      isAuthenticated: Boolean(resolvedToken || getRefreshToken()),
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
      get().setSession(data);
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
      if ((payload.token || payload.accessToken) && payload.user) {
        get().setSession(payload);
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

  logout: async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refresh_token: refreshToken });
      }
    } catch (error) {
      useToastStore.getState().showToast(getMessage(error, 'Unable to invalidate remote session.'), 'error');
    } finally {
      clearAuthSession();
      set(emptySession);
      useToastStore.getState().showToast('You have been logged out.', 'success');
    }
  },

  refreshSession: async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    const data = getResponseData(response);
    get().setSession(data);
    return data;
  },

  fetchMe: async () => {
    if (!getAccessToken() && !hasRefreshSession()) {
      clearAuthSession();
      set(emptySession);
      return null;
    }

    set({ isLoading: true, token: getAccessToken(), isAuthenticated: true });
    try {
      if (!getAccessToken() && hasRefreshSession()) {
        await get().refreshSession();
      }

      const response = await api.get('/auth/me');
      const data = getResponseData(response);
      const user = data.user || data;
      get().setSession({ token: getAccessToken(), user });
      return user;
    } catch (error) {
      clearAuthSession();
      set(emptySession);
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
      get().setSession({ token: getAccessToken(), user });
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
