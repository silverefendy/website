const Joi = require('joi');

const addCartItemSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().default(1),
});

const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().positive().required(),
});

module.exports = {
  addCartItemSchema,
  updateCartItemSchema,
};
