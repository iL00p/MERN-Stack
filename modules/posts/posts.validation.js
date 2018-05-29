const Validator = require('validator');
const { isEmpty } = require('lodash');


const validatePost = (data) => {
  const errors = {};

  if (isEmpty(data.text)) { errors.text = 'Text is required'; } else if (!Validator.isLength(data.text, { min: 10, max: 300 })) { errors.text = 'Post must be between 10 and 300 characters'; }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateComment = (data) => {
  const errors = {};

  if (isEmpty(data.text)) { errors.text = 'Text is required'; } else if (!Validator.isLength(data.text, { min: 10, max: 300 })) { errors.text = 'Post must be between 10 and 300 characters'; }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = {
  validatePost,
  validateComment,
};
