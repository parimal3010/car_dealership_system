const { EMAIL_REGEX, MIN_PASSWORD_LENGTH } = require('../utils/constants');

function validateRegisterInput({ name, email, password }) {
  if (!name) {
    return 'Name is required';
  }

  if (!email) {
    return 'Email is required';
  }

  if (!password) {
    return 'Password is required';
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'Invalid email format';
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return 'Password must be at least 6 characters';
  }

  return null;
}

module.exports = { validateRegisterInput };
