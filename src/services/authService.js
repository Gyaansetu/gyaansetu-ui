import api from './api';

/**
 * Parse JWT token to extract claims
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded JWT payload or null if invalid
 */
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * Authentication Service
 * Handles Google OAuth-based authentication and user registration
 */

export const authService = {
  /**
   * Register new user (Parent or Tutor)
   * @param {Object} userData - User registration data
   * @returns {Promise} Response with user details
   */
  register: async (userData) => {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = authService.getCurrentUser();
    return !!(token && user);
  },

  /**
   * Get user role
   * @returns {string|null} PARENT, TUTOR, or ADMIN
   */
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || null;
  },
};

export default authService;
