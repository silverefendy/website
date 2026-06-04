const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');
const { isCustomer, isSeller } = require('../middleware/roleMiddleware');
const { uploadMultiple } = require('../middleware/uploadMiddleware');
const validate = require('../validators/validateRequest');
const { createProductSchema, updateProductSchema, reviewSchema } = require('../validators/productValidator');
const { listProducts, getProduct, getProductById, createProduct, updateProduct, createReview } = require('../controllers/productController');

const router = express.Router();
router.get('/', listProducts);
router.get('/id/:id', authMiddleware, isSeller, getProductById);
router.post('/', authMiddleware, isSeller, uploadMultiple('images'), validate(createProductSchema), createProduct);
router.put('/:id', authMiddleware, isSeller, uploadMultiple('images'), validate(updateProductSchema), updateProduct);
router.get('/:slug', optionalAuthMiddleware, getProduct);
router.post('/:slug/reviews', authMiddleware, isCustomer, validate(reviewSchema), createReview);
module.exports = router;
