import useToastStore from '../../stores/toastStore';

const toneClasses = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-primary-200 bg-primary-50 text-primary-800',
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => removeToast(toast.id)}
          className={`rounded-xl border px-4 py-3 text-left text-sm font-medium shadow-lg ${toneClasses[toast.type] || toneClasses.info}`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
};

export default ToastContainer;
