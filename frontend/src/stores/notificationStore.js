import { create } from 'zustand';
import api from '../api/axios';
import useToastStore from './toastStore';

const countUnread = (notifications) => notifications.filter((notification) => !notification.is_read).length;
const messageFrom = (error, fallback) => error.response?.data?.message || error.message || fallback;

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      const payload = response.data?.data || response.data || {};
      const notifications = payload.notifications || payload.items || [];
      set({ notifications, unreadCount: Number(payload.unreadCount ?? payload.unread_count ?? countUnread(notifications)) });
      return notifications;
    } catch (error) {
      useToastStore.getState().showToast(messageFrom(error, 'Unable to load notifications.'), 'error');
      throw error;
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      set((state) => {
        const notifications = state.notifications.map((notification) => (
          notification.id === id ? { ...notification, is_read: true } : notification
        ));
        return { notifications, unreadCount: countUnread(notifications) };
      });
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast(messageFrom(error, 'Unable to update notification.'), 'error');
      throw error;
    }
  },
}));

export default useNotificationStore;
