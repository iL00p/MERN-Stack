const Validator = require('validator');
const _ = require('lodash');


const validateEmail = (email, errors) => {
  if (_.isEmpty(email)) { errors.email = 'Email is required'; } else if (!Validator.isEmail(email)) { errors.email = 'Invalid Email'; }
};


const validateRegisteration = (data) => {
  const errors = {};

  if (_.isEmpty(data.name)) { errors.name = 'Name is required'; } else if (!Validator.isLength(data.name, {
    min: 2,
    max: 30,
  })) { errors.name = 'Name must be between 2 and 30 characters'; }

  validateEmail(data.email, errors);

  if (_.isEmpty(data.password)) { errors.password = 'Password is required'; } else if (_.isEmpty(data.confirmPassword)) { errors.confirmPassword = 'Confirm Password is required'; } else if (!Validator.isLength(data.password, { min: 6 })) { errors.password = 'Password should have atleast 6 characters'; } else if (!Validator.equals(data.password, data.confirmPassword)) { errors.password = 'Password mismatch'; }

  return { errors, isValid: _.isEmpty(errors) };
};

const validateLogin = (data) => {
  const errors = {};

  validateEmail(data.email, errors);

  if (_.isEmpty(data.password)) { errors.password = 'Password is required'; }

  return {
    errors,
    isValid: _.isEmpty(errors),
  };
};

module.exports = {
  validateRegisteration,
  validateLogin,
};
