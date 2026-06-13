const { z } = require('zod');
const authService = require('../services/auth.service');
const { successResponse } = require('../utils/apiResponse');

// Validation schemas
const signupSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().min(1, 'Name is required').optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const data = await authService.signupUser(email, password, name);
    return successResponse(res, data, 'User signed up successfully', null, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    return successResponse(res, data, 'User logged in successfully');
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const data = await authService.getUserProfile(req.user.id);
    return successResponse(res, data, 'User profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signupSchema,
  loginSchema,
  signup,
  login,
  getMe
};
