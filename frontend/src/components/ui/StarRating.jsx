const StarRating = ({ rating = 0, maxRating = 5, showCount = false, count = 0 }) => {
  const numericRating = Number(rating) || 0;

  return (
    <div className="flex items-center gap-1" aria-label={`${numericRating} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }, (_, index) => {
        const value = index + 1;
        const isFilled = numericRating >= value;
        const isHalf = !isFilled && numericRating >= value - 0.5;
        return (
          <span key={value} className={isFilled || isHalf ? 'text-amber-400' : 'text-slate-300'}>
            {isHalf ? '★' : '★'}
          </span>
        );
      })}
      {showCount && <span className="ml-1 text-xs text-slate-500">({count})</span>}
    </div>
  );
};

export default StarRating;
