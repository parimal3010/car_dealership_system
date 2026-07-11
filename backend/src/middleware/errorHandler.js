const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  return res.status(500).json({ message: 'Server error' });
};

module.exports = errorHandler;
