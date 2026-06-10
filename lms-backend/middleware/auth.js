const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || typeof authHeader !== 'string') {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return res.status(401).json({ error: 'Invalid authorization header format.' });
    }

    const token = parts[1].trim();
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({ error: 'Authentication provider is misconfigured.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.sub || decoded.userId;

    if (!userId || typeof userId !== 'string') {
      return res.status(401).json({ error: 'Invalid token payload.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    req.userId = user.id;
    req.userRole = user.role;
    req.userEmail = user.email;
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Not authorized.' });
  }

  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || typeof authHeader !== 'string') {
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return next();
    }

    const token = parts[1].trim();
    if (!token) {
      return next();
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.sub || decoded.userId;
    if (!userId || typeof userId !== 'string') {
      return next();
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return next();
    }

    req.userId = user.id;
    req.userRole = user.role;
    req.userEmail = user.email;
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.warn('Optional auth skipped:', error.message);
  }

  next();
};

module.exports = auth;
module.exports.optionalAuth = optionalAuth;
module.exports.requireRole = requireRole;
