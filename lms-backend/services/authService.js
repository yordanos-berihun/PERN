const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');

class AuthService {
  static generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  }

  static generateRefreshToken(id) {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  static async register(userData) {
    const { name, email, password } = userData;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = this.generateToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
      refreshToken
    };
  }

  static async login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.generateToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
      refreshToken
    };
  }

  static async refreshToken(refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const newToken = this.generateToken(user._id);
    return { token: newToken };
  }
}

module.exports = AuthService;