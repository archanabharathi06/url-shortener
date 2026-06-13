import api from './api';

const signup = async (email, password, name) => {
  const response = await api.post('/api/auth/signup', { email, password, name });
  return response.data; // Standardized: { success, data: { user, token }, message }
};

const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data; // Standardized: { success, data: { user, token }, message }
};

const getMe = async () => {
  const response = await api.get('/api/auth/me');
  return response.data; // Standardized: { success, data: user, message }
};

const authService = {
  signup,
  login,
  getMe
};

export default authService;
