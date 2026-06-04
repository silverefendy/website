const Joi = require('joi');

const productStatuses = ['active', 'inactive', 'draft', 'archived'];
const weightUnits = ['g', 'kg', 'lb', 'pcs', 'ml', 'l'];

const productPayload = {
  name: Joi.string().trim().min(2).max(200).required(),
  slug: Joi.string().trim().max(191).allow('', null),
  category_id: Joi.number().integer().positive().required(),
  description: Joi.string().trim().min(20).required(),
  price: Joi.number().precision(2).min(0).required(),
  stock: Joi.number().integer().min(0).default(0),
  weight: Joi.number().precision(2).min(0).required(),
  weight_unit: Joi.string().valid(...weightUnits).default('g'),
  condition: Joi.string().valid('new', 'used').default('new'),
  status: Joi.string().valid(...productStatuses).default('draft'),
  primary_image_index: Joi.number().integer().min(0).default(0),
};

const createProductSchema = Joi.object(productPayload);
const updateProductSchema = Joi.object({
  ...productPayload,
  name: productPayload.name.optional(),
  category_id: productPayload.category_id.optional(),
  description: productPayload.description.optional(),
  price: productPayload.price.optional(),
  stock: Joi.forbidden().messages({ 'any.unknown': 'Use the stock adjustment endpoint to change stock.' }),
  weight: productPayload.weight.optional(),
  weight_unit: productPayload.weight_unit.optional(),
}).min(1);

const stockAdjustmentSchema = Joi.object({
  movement_type: Joi.string().valid('IN', 'OUT', 'ADJUSTMENT').required(),
  quantity: Joi.number().integer().min(0).required(),
  reason: Joi.string().trim().min(2).max(255).required(),
});

const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().max(5000).allow('', null),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  stockAdjustmentSchema,
  reviewSchema,
  productStatuses,
  weightUnits,
};
