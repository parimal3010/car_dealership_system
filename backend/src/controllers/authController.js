const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateRegisterInput } = require("../validators/registerValidator");
const { findUserByEmail, registerUser } = require("../services/authService");
const { formatUserResponse } = require("../utils/formatUser");
const { EMAIL_REGEX } = require("../utils/constants");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const validationError = validateRegisterInput({ name, email, password });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const user = await registerUser({ name, email, password });

  return res.status(201).json({
    message: "User registered successfully",
    user: formatUserResponse(user),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

  return res.status(200).json({
    message: "Login successful",
    token,
    user: formatUserResponse(user),
  });
};

module.exports = {
  register,
  login,
};
