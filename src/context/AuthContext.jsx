import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage and handle OAuth callback
  useEffect(() => {
    const initAuth = () => {
      // Check for token in URL (from Google OAuth redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        // Store token and parse user data from JWT
        localStorage.setItem('authToken', token);
        
        // Parse JWT to extract user info
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userData = {
            id: payload.userId,
            email: payload.sub,
            role: payload.role,
            name: payload.name,
          };
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('Error parsing token:', error);
        }
      } else {
        // Load from localStorage
        const storedUser = authService.getCurrentUser();
        const storedToken = localStorage.getItem('authToken');

        if (storedUser && storedToken) {
          setUser(storedUser);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login with Google OAuth - handled by backend redirect
   */
  const loginWithGoogle = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  /**
   * Register new user
   * @param {Object} userData - Registration data
   */
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Login user (for OTP and other non-OAuth flows)
   * @param {Object} userData - User data
   * @param {string} token - JWT token
   */
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Logout user
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check (PARENT, TUTOR, ADMIN)
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    login,
    register,
    logout,
    hasRole,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
