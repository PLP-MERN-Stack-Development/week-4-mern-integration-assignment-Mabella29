const Joi = require('joi')

// Post validation schema
const postSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(10).required(),
  category: Joi.string().allow('').optional() 
});

// Category validation schema
const categorySchema = Joi.object({
  name: Joi.string().min(2).max(30).required()
});

module.exports = {postSchema,categorySchema}