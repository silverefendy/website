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

const register = async (req, res) => {
  try {
    const data = await authService.register(req.validated?.body || req.body);
    return successResponse(res, data, 'Registration successful.', 201);
  } catch (error) {
    return sendError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.login(req.validated?.body || req.body);
    return successResponse(res, data, 'Login successful.');
  } catch (error) {
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
  getMe,
  updateProfile,
  changePassword,
};
