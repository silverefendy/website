import { useNavigate } from 'react-router-dom';
import { DEFAULT_PRODUCT_IMAGE, formatPrice, resolveImageUrl } from '../../config/constants';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const imageSrc = resolveImageUrl(product?.primary_image || product?.image_path || product?.image);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/products/${product.slug}`)}
      onKeyDown={(event) => event.key === 'Enter' && navigate(`/products/${product.slug}`)}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={product.name}
          onError={(event) => { event.currentTarget.src = DEFAULT_PRODUCT_IMAGE; }}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-600">{product.condition || 'new'}</span>
          <StarRating rating={product.average_rating} showCount count={product.review_count || 0} />
        </div>
        <h3 className="line-clamp-2 min-h-[3rem] font-semibold text-slate-900">{product.name}</h3>
        <p className="text-lg font-bold text-primary-700">{formatPrice(product.price)}</p>
        {Number(product.stock || 0) === 0 ? <p className="text-sm font-semibold text-red-600">Out of stock</p> : Number(product.stock || 0) <= 5 && <p className="text-sm font-semibold text-amber-600">Low stock: {product.stock} left</p>}
        <p className="truncate text-sm text-slate-500">{product.store_name}</p>
      </div>
    </article>
  );
};

export default ProductCard;
