const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { isSeller } = require('../middleware/roleMiddleware');
const { dashboard, products } = require('../controllers/sellerController');
const router = express.Router();
router.use(authMiddleware, isSeller);
router.get('/dashboard', dashboard);
router.get('/products', products);
module.exports = router;
