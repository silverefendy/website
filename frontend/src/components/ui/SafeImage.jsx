import { useEffect, useState } from 'react';
import { DEFAULT_PRODUCT_IMAGE, resolveImageUrl } from '../../config/constants';

const SafeImage = ({ src, fallbackSrc = DEFAULT_PRODUCT_IMAGE, alt = '', onError, ...props }) => {
  const resolvedSrc = resolveImageUrl(src, fallbackSrc);
  const resolvedFallback = resolveImageUrl(fallbackSrc, DEFAULT_PRODUCT_IMAGE);
  const [useFallback, setUseFallback] = useState(!resolvedSrc || resolvedSrc === resolvedFallback);

  useEffect(() => {
    setUseFallback(!resolvedSrc || resolvedSrc === resolvedFallback);
  }, [resolvedSrc, resolvedFallback]);

  const imageSrc = useFallback ? resolvedFallback : resolvedSrc;

  const handleError = (event) => {
    if (!useFallback) {
      setUseFallback(true);
      return;
    }

    event.currentTarget.style.visibility = 'hidden';
    onError?.(event);
  };

  return <img src={imageSrc} alt={alt} onError={handleError} {...props} />;
};

export default SafeImage;
