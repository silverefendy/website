const categoryRepository = require('../repositories/categoryRepository');
const { successResponse } = require('../helpers/responseHelper');

const listCategories = async (req, res, next) => {
  try {
    const categories = await categoryRepository.list();
    return successResponse(res, { categories }, 'Categories retrieved successfully.');
  } catch (error) {
    return next(error);
  }
};

module.exports = { listCategories };
