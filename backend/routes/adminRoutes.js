const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const validate = require('../validators/validateRequest');
const { createCategorySchema, updateCategorySchema } = require('../validators/categoryValidator');
const { updateOrderStatusSchema } = require('../validators/orderValidator');
const {
  dashboard,
  listUsers,
  updateUser,
  listOrders,
  updateOrderStatus,
  createCategory,
  updateCategory,
  deleteCategory,
  listSettings,
  updateSetting,
} = require('../controllers/adminController');

const router = express.Router();

router.use(authMiddleware, isAdmin);
router.get('/stats', dashboard);
router.get('/users', listUsers);
router.put('/users/:userId', updateUser);
router.get('/orders', listOrders);
router.put('/orders/:orderId/status', validate(updateOrderStatusSchema), updateOrderStatus);
router.post('/categories', uploadSingle('image'), validate(createCategorySchema), createCategory);
router.put('/categories/:categoryId', uploadSingle('image'), validate(updateCategorySchema), updateCategory);
router.delete('/categories/:categoryId', deleteCategory);
router.get('/settings', listSettings);
router.put('/settings/:settingKey', updateSetting);

module.exports = router;
