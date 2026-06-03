const sizeClasses = {
  sm: 'h-5 w-5 border-2',
  md: 'h-9 w-9 border-4',
  lg: 'h-14 w-14 border-4',
};

const LoadingSpinner = ({ size = 'md' }) => (
  <div className="flex w-full items-center justify-center py-10" role="status" aria-label="Loading">
    <div className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-slate-200 border-t-primary-600`} />
  </div>
);

export default LoadingSpinner;
