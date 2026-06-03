const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  email: Joi.string().trim().lowercase().email().max(191).required(),
  password: Joi.string().min(8).max(255).required(),
  role: Joi.string().valid('seller', 'customer').required(),
  store_name: Joi.string().trim().max(150).allow('', null),
  description: Joi.string().trim().max(5000).allow('', null),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().max(191).required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150),
  phone: Joi.string().trim().max(30).allow('', null),
  store_name: Joi.string().trim().min(2).max(150),
  description: Joi.string().trim().max(5000).allow('', null),
  address: Joi.string().trim().max(5000).allow('', null),
  city: Joi.string().trim().max(100).allow('', null),
  province: Joi.string().trim().max(100).allow('', null),
  postal_code: Joi.string().trim().max(20).allow('', null),
});

const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().allow('', null),
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(8).max(255).required(),
  confirm_password: Joi.string().valid(Joi.ref('new_password')).required().messages({
    'any.only': 'Password confirmation does not match.',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  refreshTokenSchema,
  changePasswordSchema,
};
