const { EMAIL_REGEX } = require("../utils/constants");

function validateLoginInput({ email, password }) {
  if (!email) {
    return "Email is required";
  }

  if (!password) {
    return "Password is required";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Invalid email format";
  }

  return null;
}

module.exports = { validateLoginInput };
