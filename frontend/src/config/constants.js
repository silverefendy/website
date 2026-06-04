export const API_URL = import.meta.env.VITE_API_URL || '';
export const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'Marketplace';
export const SITE_TAGLINE = import.meta.env.VITE_SITE_TAGLINE || 'Multi User Marketplace';
export const CURRENCY = import.meta.env.VITE_CURRENCY || 'IDR';
export const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || 'Rp';
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'support@example.com';
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '6281234567890';

const indonesiaLocale = 'id-ID';

export const DEFAULT_PRODUCT_IMAGE = `${API_URL}/uploads/default-product.jpg`;
export const DEFAULT_AVATAR_IMAGE = `${API_URL}/uploads/default-avatar.png`;

export const formatPrice = (amount) => {
  const numericAmount = Number(amount) || 0;
  const formattedAmount = new Intl.NumberFormat(indonesiaLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);

  return `${CURRENCY_SYMBOL} ${formattedAmount}`;
};

export const resolveImageUrl = (path) => {
  if (!path) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  if (String(path).startsWith('http')) {
    return path;
  }

  return `${API_URL}/${String(path).replace(/^\/+/, '')}`;
};

export const buildWhatsAppUrl = (message = '') => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};
