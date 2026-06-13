const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User.model');
const { errorResponse } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Not authorized to access this route. Token missing.', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 'The user belonging to this token no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized. Token is invalid or expired.', 401);
  }
};

module.exports = { protect };
