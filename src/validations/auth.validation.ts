import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'user').required(),
});

export const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  rePassword: Joi.any().valid(Joi.ref('password')).required(),
});
