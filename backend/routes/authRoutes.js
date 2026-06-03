const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const validate = require('../validators/validateRequest');
const authRateLimiter = require('../middleware/rateLimitMiddleware');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  refreshTokenSchema,
  changePasswordSchema,
} = require('../validators/authValidator');
const {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', authRateLimiter, validate(registerSchema), register);
router.post('/login', authRateLimiter, validate(loginSchema), login);
router.post('/refresh', authRateLimiter, validate(refreshTokenSchema), refresh);
router.post('/logout', validate(refreshTokenSchema), logout);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, uploadSingle('avatar'), validate(updateProfileSchema), updateProfile);
router.put('/change-password', authMiddleware, validate(changePasswordSchema), changePassword);

module.exports = router;
