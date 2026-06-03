const parseCookies = (cookieHeader = '') => {
  return cookieHeader.split(';').reduce((cookies, pair) => {
    const [rawKey, ...rawValue] = pair.trim().split('=');
    if (!rawKey) return cookies;
    cookies[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});
};

const cookieMiddleware = (req, res, next) => {
  req.cookies = parseCookies(req.headers.cookie || '');
  return next();
};

module.exports = cookieMiddleware;
