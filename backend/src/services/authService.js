const User = require("../models/User");

async function findUserByEmail(email) {
  return User.findOne({ email });
}

async function registerUser(userData) {
  return User.create(userData);
}

module.exports = {
  findUserByEmail,
  registerUser,
};
