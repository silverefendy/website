const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../helpers/responseHelper');
const { toPublicError } = require('../helpers/errorHelper');

/**
 * Auth controllers are intentionally thin: they receive the Express request,
 * delegate all business work to the service layer, and format the HTTP response.
 */
const sendError = (res, error) => {
  const publicError = toPublicError(error);
  return errorResponse(res, publicError.message, publicError.statusCode, publicError.errors);
};

const getRequestMetadata = (req) => ({
  userAgent: req.get('user-agent'),
  ipAddress: req.ip,
});

const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie('refresh_token', { path: '/api/auth' });
};

const register = async (req, res) => {
  try {
    const data = await authService.register(req.validated?.body || req.body, getRequestMetadata(req));
    setRefreshCookie(res, data.refreshToken);
    return successResponse(res, data, 'Registration successful.', 201);
  } catch (error) {
    return sendError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.login(req.validated?.body || req.body, getRequestMetadata(req));
    setRefreshCookie(res, data.refreshToken);
    return successResponse(res, data, 'Login successful.');
  } catch (error) {
    return sendError(res, error);
  }
};

const refresh = async (req, res) => {
  try {
    const data = await authService.refresh({
      refreshToken: req.validated?.body?.refresh_token || req.cookies?.refresh_token,
      metadata: getRequestMetadata(req),
    });
    setRefreshCookie(res, data.refreshToken);
    return successResponse(res, data, 'Token refreshed successfully.');
  } catch (error) {
    clearRefreshCookie(res);
    return sendError(res, error);
  }
};

const logout = async (req, res) => {
  try {
    await authService.logout({
      userId: req.user?.id,
      refreshToken: req.validated?.body?.refresh_token || req.cookies?.refresh_token,
    });
    clearRefreshCookie(res);
    return successResponse(res, null, 'Logout successful.');
  } catch (error) {
    clearRefreshCookie(res);
    return sendError(res, error);
  }
};

const getMe = async (req, res) => {
  try {
    const data = await authService.getMe(req.user.id);
    return successResponse(res, data, 'Current user retrieved.');
  } catch (error) {
    return sendError(res, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = await authService.updateProfile({
      userId: req.user.id,
      payload: req.validated?.body || req.body,
      file: req.file,
    });
    return successResponse(res, data, 'Profile updated successfully.');
  } catch (error) {
    return sendError(res, error);
  }
};

const changePassword = async (req, res) => {
  try {
    await authService.changePassword({
      userId: req.user.id,
      currentPassword: req.validated?.body?.current_password || req.body.current_password,
      newPassword: req.validated?.body?.new_password || req.body.new_password,
    });
    return successResponse(res, null, 'Password changed successfully.');
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
  changePassword,
};
