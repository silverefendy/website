const slugify = (value) => {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const normalizeNullableText = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized || null;
};

module.exports = {
  slugify,
  normalizeEmail,
  normalizeNullableText,
};
