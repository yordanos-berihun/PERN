const Joi = require('joi');
const AppError = require('../utils/AppError');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(message, 400));
    }
    next();
  };
};

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const courseSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced').required()
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  courseSchema
};