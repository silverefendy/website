const Joi = require('joi');

const createOrderSchema = Joi.object({
  item_ids: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
  shipping_address: Joi.string().trim().min(5).required(),
  shipping_city: Joi.string().trim().max(100).required(),
  shipping_province: Joi.string().trim().max(100).required(),
  shipping_postal_code: Joi.string().trim().max(20).required(),
  notes: Joi.string().trim().max(5000).allow('', null),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled').required(),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};
