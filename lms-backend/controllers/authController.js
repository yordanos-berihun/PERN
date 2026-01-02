const AuthService = require('../services/authService');
const { asyncWrapper } = require('../middleware/errorHandler');

const register = asyncWrapper(async (req, res) => {
  const result = await AuthService.register(req.body);
  
  res.status(201).json({
    success: true,
    data: result
  });
});

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);
  
  res.json({
    success: true,
    data: result
  });
});

const refreshToken = asyncWrapper(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await AuthService.refreshToken(refreshToken);
  
  res.json({
    success: true,
    data: result
  });
});

const getProfile = asyncWrapper(async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = {
  register,
  login,
  refreshToken,
  getProfile
};