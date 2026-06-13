import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Optionally verify token with a quick profile call
        try {
          const profileResponse = await authService.getMe();
          if (profileResponse.success) {
            setUser(profileResponse.data);
            localStorage.setItem('user', JSON.stringify(profileResponse.data));
          }
        } catch (error) {
          console.error('Token validation failed during startup:', error);
          // Token is likely invalid/expired, axios interceptor will handle or we clear it
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen to unauthorized interceptor events
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('unauthorized-api-call', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized-api-call', handleUnauthorized);
    };
  }, []);

  const signup = async (email, password, name) => {
    setLoading(true);
    try {
      const response = await authService.signup(email, password, name);
      if (response.success && response.data) {
        const { user: newUser, token: newToken } = response.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        return { success: true };
      }
      return { success: false, message: response.message || 'Signup failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Server error during signup'
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        const { user: loggedUser, token: newToken } = response.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setToken(newToken);
        setUser(loggedUser);
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
