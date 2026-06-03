export const SITE_NAME = import.meta.env.VITE_SITE_NAME;
export const SITE_TAGLINE = import.meta.env.VITE_SITE_TAGLINE;
export const CURRENCY = import.meta.env.VITE_CURRENCY;
export const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL;
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL;

const indonesiaLocale = 'id-ID';

export const formatPrice = (amount) => {
  const numericAmount = Number(amount) || 0;
  const formattedAmount = new Intl.NumberFormat(indonesiaLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);

  return `${CURRENCY_SYMBOL} ${formattedAmount}`;
};
