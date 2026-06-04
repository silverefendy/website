const Joi = require('joi');

const productPayload = {
  name: Joi.string().trim().min(2).max(200).required(),
  slug: Joi.string().trim().max(191).allow('', null),
  category_id: Joi.number().integer().positive().required(),
  description: Joi.string().trim().min(20).required(),
  price: Joi.number().precision(2).min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  weight: Joi.number().precision(2).min(0).required(),
  condition: Joi.string().valid('new', 'used').default('new'),
  status: Joi.string().valid('active', 'inactive', 'deleted').default('active'),
  primary_image_index: Joi.number().integer().min(0).default(0),
};

const createProductSchema = Joi.object(productPayload);
const updateProductSchema = Joi.object({
  ...productPayload,
  name: productPayload.name.optional(),
  category_id: productPayload.category_id.optional(),
  description: productPayload.description.optional(),
  price: productPayload.price.optional(),
  stock: productPayload.stock.optional(),
  weight: productPayload.weight.optional(),
}).min(1);

const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().max(5000).allow('', null),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  reviewSchema,
};
