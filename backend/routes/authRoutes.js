const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, uploadSingle('avatar'), updateProfile);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
