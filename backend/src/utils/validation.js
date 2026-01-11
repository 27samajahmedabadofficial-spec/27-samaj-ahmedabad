import validator from 'validator';

export const validatePassword = (password) => {
  // Minimum 6 characters
  return password && password.length >= 6;
};

export const validateMobileNo = (mobileNo) => {
  // Mobile number: 10 digits (India format) or flexible international format
  return mobileNo && /^[0-9]{10,15}$/.test(mobileNo.replace(/[\s\-()]/g, ''));
};

export const validateRegistrationInput = (mobileNo, password) => {
  const errors = {};

  if (!mobileNo || !validateMobileNo(mobileNo)) {
    errors.mobileNo = 'Please provide a valid mobile number (10-15 digits)';
  }

  if (!password || !validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginInput = (mobileNo, password) => {
  const errors = {};

  if (!mobileNo || !validateMobileNo(mobileNo)) {
    errors.mobileNo = 'Please provide a valid mobile number (10-15 digits)';
  }

  if (!password || !validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
