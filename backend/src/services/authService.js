const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function findUserByEmail(email) {
  return User.findOne({ email });
}

async function registerUser(userData) {
  return User.create(userData);
}

async function authenticateUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  return user;
}

module.exports = {
  findUserByEmail,
  registerUser,
  authenticateUser,
};
