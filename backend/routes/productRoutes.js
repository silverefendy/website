const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');
const { isCustomer } = require('../middleware/roleMiddleware');
const { listProducts, getProduct, createReview } = require('../controllers/productController');

const router = express.Router();
router.get('/', listProducts);
router.get('/:slug', optionalAuthMiddleware, getProduct);
router.post('/:slug/reviews', authMiddleware, isCustomer, createReview);
module.exports = router;
