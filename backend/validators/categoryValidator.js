const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  slug: Joi.string().trim().max(191),
  description: Joi.string().trim().max(5000).allow('', null),
  parent_id: Joi.number().integer().positive().allow('', null),
});

const updateCategorySchema = createCategorySchema.fork(['name'], (schema) => schema.optional()).min(1);

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
