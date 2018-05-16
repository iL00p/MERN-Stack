const Validator = require('validator');
const isEmpty = require('lodash').isEmpty;

const PROFILE_FIELDS = require('../../config/appConfig').profileFields;

validateProfileFields = (data) => {
  const errors = {};

  if (isEmpty(data.handle)) 
    errors.handle = 'Handle is required';
  else if (!Validator.isLength(data.handle, {
    min: 2,
    max: 40
  })) 
    errors.handle = 'Handle need to be between 2 and 40 characters';
  
  if (isEmpty(data.status)) 
    errors.status = 'Status is required';
  
  if (isEmpty(data.skills)) 
    errors.skills = 'Skills are required';
  
  if (!isEmpty(data.website) && !Validator.isURL(data.website)) 
    errors.website = 'Not a valid URL';
  
  if (!isEmpty(data.youtube) && !Validator.isURL(data.youtube)) 
    errors.youtube = 'Not a valid URL';
  
  if (!isEmpty(data.facebook) && !Validator.isURL(data.facebook)) 
    errors.facebook = 'Not a valid URL';
  
  if (!isEmpty(data.linkedin) && !Validator.isURL(data.linkedin)) 
    errors.linkedin = 'Not a valid URL';
  
  if (!isEmpty(data.twitter) && !Validator.isURL(data.twitter)) 
    errors.twitter = 'Not a valid URL';
  
  if (!isEmpty(data.instagram) && !Validator.isURL(data.instagram)) 
    errors.instagram = 'Not a valid URL';
  
  return {
    errors, isValid: isEmpty(errors)
  }
}

validateExperience = ( data ) => {
  const errors = {};
  
  if (isEmpty(data.title)) 
    errors.title = 'Title is required';
  else if (!Validator.isLength(data.title, {
    min: 2,
    max: 40
  }))
  errors.title = 'Title should have more than 2 characters';
  
  if (isEmpty(data.company)) 
    errors.company = 'Company is required';
  else if (!Validator.isLength(data.company, {
    min: 2,
    max: 40
  }))
  errors.company = 'Company should have more than 2 characters';
  
  if (isEmpty(data.from)) 
    errors.from = 'From date is required';
    
  if ( ( data.current === 'false' || !data.current ) && isEmpty(data.to))
    errors.to = 'To date is required';

  return {
    errors, isValid: isEmpty(errors)
  }
}

validateEducation = ( data ) => {
  const errors = {};
  
  if (isEmpty(data.school)) 
    errors.school = 'School is required';
  else if (!Validator.isLength(data.school, {
    min: 2,
    max: 40
  }))
  errors.school = 'School should have more than 2 characters';
  
  if (isEmpty(data.degree)) 
    errors.degree = 'Degree is required';
  else if (!Validator.isLength(data.degree, {
    min: 2,
    max: 40
  }))
  errors.degree = 'Degree should have more than 2 characters';
  
  if (isEmpty(data.fieldofstudy)) 
    errors.fieldofstudy = 'Field Of Study is required';
  else if (!Validator.isLength(data.fieldofstudy, {
    min: 2,
    max: 40
  }))
  errors.fieldofstudy = 'Field Of Study should have more than 2 characters';
  
  if (isEmpty(data.from)) 
    errors.from = 'From date is required';
    
  if ( ( data.current === 'false' || !data.current ) && isEmpty(data.to))
    errors.to = 'To date is required';

  return {
    errors, isValid: isEmpty(errors)
  }
}

module.exports = {
  validateProfileFields,
  validateExperience,
  validateEducation
}