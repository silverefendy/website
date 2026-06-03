const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const validate = require('../validators/validateRequest');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} = require('../validators/authValidator');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, uploadSingle('avatar'), validate(updateProfileSchema), updateProfile);
router.put('/change-password', authMiddleware, validate(changePasswordSchema), changePassword);

module.exports = router;
