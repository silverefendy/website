const productRepository = require('../repositories/productRepository');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

const listProducts = async (req, res, next) => {
  try {
    const data = await productRepository.list(req.query);
    return successResponse(res, data, 'Products retrieved successfully.');
  } catch (error) {
    return next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await productRepository.findDetailBySlug(req.params.slug, req.user?.id);
    if (!product) return errorResponse(res, 'Product not found.', 404);
    return successResponse(res, { product }, 'Product retrieved successfully.');
  } catch (error) {
    return next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || '').trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return errorResponse(res, 'Rating must be between 1 and 5.', 422);
    const product = await productRepository.findDetailBySlug(req.params.slug, req.user.id);
    if (!product) return errorResponse(res, 'Product not found.', 404);
    await productRepository.upsertReview({ productId: product.id, userId: req.user.id, rating, comment });
    return successResponse(res, null, 'Review submitted successfully.', 201);
  } catch (error) {
    return next(error);
  }
};

module.exports = { listProducts, getProduct, createReview };
