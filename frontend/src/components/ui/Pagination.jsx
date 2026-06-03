const buildPages = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];
  if (currentPage > 4) pages.push('start-ellipsis');

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let page = start; page <= end; page += 1) pages.push(page);

  if (currentPage < totalPages - 3) pages.push('end-ellipsis');
  pages.push(totalPages);
  return pages;
};

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const buttonClass = 'rounded-lg border px-3 py-2 text-sm font-medium transition';

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        Prev
      </button>
      {buildPages(currentPage, totalPages).map((page) => (
        typeof page === 'number' ? (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`${buttonClass} ${page === currentPage ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300'}`}
          >
            {page}
          </button>
        ) : (
          <span key={page} className="px-2 text-slate-400">…</span>
        )
      ))}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
