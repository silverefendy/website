const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const LEGACY_TOKEN_KEY = 'token';

let accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);

export const getAccessToken = () => accessToken;

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setAuthSession = ({ token, accessToken: nextAccessToken, refreshToken }) => {
  const resolvedAccessToken = nextAccessToken || token;
  if (resolvedAccessToken) {
    accessToken = resolvedAccessToken;
    sessionStorage.setItem(ACCESS_TOKEN_KEY, resolvedAccessToken);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const clearAuthSession = () => {
  accessToken = null;
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
};

export const hasRefreshSession = () => Boolean(getRefreshToken());
