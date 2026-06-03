const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
    <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-2xl text-primary-700">☆</div>
    <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
    {description && <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{description}</p>}
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="mt-6 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
