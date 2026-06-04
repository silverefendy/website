import axios from 'axios';
import { clearAuthSession, getAccessToken, getRefreshToken, setAuthSession } from '../utils/authSession';

const baseURL = `${import.meta.env.VITE_API_URL || ''}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let refreshPromise = null;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios.post(
      `${baseURL}/auth/refresh`,
      { refresh_token: getRefreshToken() },
      { withCredentials: true },
    ).then((response) => {
      const data = response.data?.data || response.data || {};
      setAuthSession(data);
      return data.accessToken || data.token;
    }).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry && getRefreshToken()) {
      originalRequest._retry = true;
      try {
        const token = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAuthSession();
        window.location.assign('/login');
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401 && !getRefreshToken()) {
      clearAuthSession();
      window.location.assign('/login');
    }

    return Promise.reject(error);
  },
);

export default api;
