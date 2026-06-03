import { create } from 'zustand';

const createToast = (type, message) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  type,
  message,
});

const useToastStore = create((set) => ({
  toasts: [],
  showToast: (message, type = 'info') => {
    const toast = createToast(type, message);
    set((state) => ({ toasts: [...state.toasts, toast] }));
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((item) => item.id !== toast.id) }));
    }, 3500);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));

export default useToastStore;
