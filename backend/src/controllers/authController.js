const { validateRegisterInput } = require('../validators/registerValidator');
const { findUserByEmail, registerUser } = require('../services/authService');
const { formatUserResponse } = require('../utils/formatUser');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const validationError = validateRegisterInput({ name, email, password });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  const user = await registerUser({ name, email, password });

  return res.status(201).json({
    message: 'User registered successfully',
    user: formatUserResponse(user),
  });
};

module.exports = {
  register,
};
