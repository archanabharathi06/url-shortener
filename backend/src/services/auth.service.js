const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { hashPassword } = require('../utils/hashPassword');
const env = require('../config/env');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

const signupUser = async (email, password, name) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw { statusCode: 400, message: 'Email is already registered' };
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    email,
    password: hashedPassword,
    name
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      email: user.email,
      name: user.name
    },
    token
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { statusCode: 401, message: 'Invalid email or password' };
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw { statusCode: 401, message: 'Invalid email or password' };
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      email: user.email,
      name: user.name
    },
    token
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }
  return user;
};

module.exports = {
  signupUser,
  loginUser,
  getUserProfile
};
