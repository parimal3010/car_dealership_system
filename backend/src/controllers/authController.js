const { validateLoginInput } = require("../validators/loginValidator");
const { validateRegisterInput } = require("../validators/registerValidator");
const {
  authenticateUser,
  findUserByEmail,
  registerUser,
} = require("../services/authService");
const { formatUserResponse } = require("../utils/formatUser");
const { generateToken } = require("../utils/generateToken");

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

  const validationError = validateLoginInput({ email, password });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const user = await authenticateUser({ email, password });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user);

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
