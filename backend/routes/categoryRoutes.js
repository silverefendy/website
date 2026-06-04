const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const validate = require('../validators/validateRequest');
const { createCategorySchema, updateCategorySchema } = require('../validators/categoryValidator');
const { listCategories } = require('../controllers/categoryController');
const { createCategory, updateCategory, deleteCategory } = require('../controllers/adminController');

const router = express.Router();
router.get('/', listCategories);
router.post('/', authMiddleware, isAdmin, uploadSingle('image'), validate(createCategorySchema), createCategory);
router.put('/:categoryId', authMiddleware, isAdmin, uploadSingle('image'), validate(updateCategorySchema), updateCategory);
router.delete('/:categoryId', authMiddleware, isAdmin, deleteCategory);
module.exports = router;
