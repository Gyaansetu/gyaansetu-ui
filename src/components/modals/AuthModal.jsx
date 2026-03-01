import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import useToast from '../../hooks/useToast';
import Toast from '../common/Toast';
import api from '../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { register, login } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  const [mode, setMode] = useState(initialMode);
  const [loginMethod, setLoginMethod] = useState('google'); // 'google' or 'otp'
  const [otpStep, setOtpStep] = useState('email'); // 'email' or 'verify'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'PARENT',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Update mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Cooldown timer for OTP
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Validate phone number (10 digits)
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Validate name
  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Only allow digits
      if (value && !/^\d*$/.test(value)) {
        return;
      }
      // Limit to 10 digits
      if (value.length > 10) {
        return;
      }
    }
    
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email || !email.includes('@')) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/otp/send', { email });
      
      if (response.success) {
        showSuccess('OTP sent to your email!');
        setOtpStep('verify');
        setCooldown(60);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      showError(errorMessage);
      setErrors({ email: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/otp/verify', { email, otp });
      
      // Interceptor extracts response.data.data into response.data
      const loginData = response.data;
      
      if (!loginData?.token) {
        throw new Error('Invalid OTP - no token received');
      }
      
      showSuccess('Login successful!');
      
      // Store token and user data
      localStorage.setItem('authToken', loginData.token);
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('user', JSON.stringify(loginData.user));
      
      // Update auth context
      login(loginData.user, loginData.token);
      
      setTimeout(() => {
        onClose();
        // Redirect based on role
        const role = loginData.user.role;
        if (role === 'ADMIN') {
          window.location.href = '/admin-dashboard';
        } else if (role === 'TUTOR') {
          window.location.href = '/tutor-profile';
        } else {
          window.location.href = '/find-tutor';
        }
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.message || error.message || 'Invalid OTP. Please try again.';
      showError(errorMessage);
      setErrors({ otp: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp('');
    setErrors({});
    await handleSendOtp({ preventDefault: () => {} });
  };

  const handleBackToEmail = () => {
    setOtpStep('email');
    setOtp('');
    setErrors({});
  };

  const switchToGoogleLogin = () => {
    setLoginMethod('google');
    setOtpStep('email');
    setEmail('');
    setOtp('');
    setErrors({});
  };

  const switchToOtpLogin = () => {
    setLoginMethod('otp');
    setOtpStep('email');
    setErrors({});
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!registerData.name) {
      newErrors.name = 'Name is required';
    } else if (!validateName(registerData.name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!registerData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!registerData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(registerData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare registration data
    const cleanData = {
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      role: registerData.role
    };

    setLoading(true);
    const result = await register(cleanData);
    setLoading(false);

    if (result.success) {
      showSuccess('Registration successful! Please login with Google using the same email.');
      // Reset registration form
      setRegisterData({ name: '', email: '', phone: '', role: 'PARENT' });
      setErrors({});
      // Switch to login mode after brief delay
      setTimeout(() => {
        setMode('login');
      }, 2000);
    } else {
      showError(result.error || 'Registration failed');
    }
  };

  const switchToRegister = () => {
    setErrors({});
    setMode('register');
  };

  const switchToLogin = () => {
    setErrors({});
    setMode('login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Welcome Header */}
          <div className="text-center mb-6 transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Welcome Back!' : 'Join GyaanSetu!'}
            </h2>
            <p className="text-gray-600">
              {mode === 'login' ? 'Login with your Google account' : 'Create your account to get started'}
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex mb-8 bg-gray-100 rounded-full p-1 relative">
            {/* Animated background slider */}
            <div 
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full shadow-md transition-all duration-300 ease-out"
              style={{ 
                backgroundColor: '#14b8a6',
                left: mode === 'login' ? '4px' : 'calc(50% + 0px)',
              }}
            />
            <button
              onClick={switchToLogin}
              className={`flex-1 py-3 text-center rounded-full font-semibold transition-all duration-300 relative z-10 ${
                mode === 'login' ? 'text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={switchToRegister}
              className={`flex-1 py-3 text-center rounded-full font-semibold transition-all duration-300 relative z-10 ${
                mode === 'register' ? 'text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Forms Container */}
          <div className="relative overflow-hidden">
            {mode === 'login' ? (
              /* Login Form - Google OAuth & OTP */
              <div className="space-y-6 animate-slideIn">
                {loginMethod === 'google' ? (
                  /* Google OAuth Login */
                  <>
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600">
                        Sign in securely with your Google account
                      </p>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-md hover:shadow-lg"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    {/* OR Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                      </div>
                    </div>

                    {/* OTP Login Button */}
                    <button
                      type="button"
                      onClick={switchToOtpLogin}
                      className="w-full py-4 bg-white border-2 border-teal-500 text-teal-600 font-semibold rounded-full transition-all shadow-md hover:shadow-lg hover:bg-teal-50 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Login with Email OTP
                    </button>

                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-6">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">First time here?</p>
                          <p className="text-blue-700">Please register first before logging in.</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* OTP Login */
                  <>
                    {otpStep === 'email' ? (
                      /* Step 1: Enter Email */
                      <form onSubmit={handleSendOtp} className="space-y-5">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">
                            Enter your email to receive a one-time password
                          </p>
                        </div>

                        <div>
                          <label htmlFor="otp-email" className="block text-sm font-semibold text-gray-900 mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="otp-email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors({});
                            }}
                            placeholder="your.email@example.com"
                            className={`w-full px-5 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-400 ${
                              errors.email ? 'border-red-400' : 'border-gray-200'
                            }`}
                            onFocus={(e) => !errors.email && (e.target.style.borderColor = '#14b8a6')}
                            onBlur={(e) => !errors.email && (e.target.style.borderColor = '#cbd5e1')}
                            required
                            autoFocus
                            disabled={loading}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1.5 ml-5">{errors.email}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending OTP...
                            </span>
                          ) : (
                            'Send OTP'
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={switchToGoogleLogin}
                          className="w-full text-teal-600 hover:text-teal-700 font-medium text-sm"
                        >
                          ← Back to Google Login
                        </button>
                      </form>
                    ) : (
                      /* Step 2: Verify OTP */
                      <form onSubmit={handleVerifyOtp} className="space-y-5">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">
                            We sent a 6-digit code to <strong>{email}</strong>
                          </p>
                        </div>

                        <div>
                          <label htmlFor="otp-code" className="block text-sm font-semibold text-gray-900 mb-2">
                            Enter 6-Digit OTP <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="otp-code"
                            value={otp}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                              setOtp(value);
                              if (errors.otp) setErrors({});
                            }}
                            placeholder="123456"
                            className={`w-full px-5 py-3 border-2 rounded-full focus:outline-none transition-colors text-center text-2xl font-mono tracking-widest ${
                              errors.otp ? 'border-red-400' : 'border-gray-200'
                            }`}
                            onFocus={(e) => !errors.otp && (e.target.style.borderColor = '#14b8a6')}
                            onBlur={(e) => !errors.otp && (e.target.style.borderColor = '#cbd5e1')}
                            required
                            autoFocus
                            maxLength={6}
                            disabled={loading}
                          />
                          {errors.otp && (
                            <p className="text-red-500 text-xs mt-1.5 ml-5">{errors.otp}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={loading || otp.length !== 6}
                          className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Verifying...
                            </span>
                          ) : (
                            'Verify & Login'
                          )}
                        </button>

                        <div className="flex items-center justify-between text-sm">
                          <button
                            type="button"
                            onClick={handleBackToEmail}
                            className="text-teal-600 hover:text-teal-700 font-medium"
                          >
                            ← Change Email
                          </button>
                          
                          {cooldown > 0 ? (
                            <span className="text-gray-500">
                              Resend in {cooldown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              className="text-teal-600 hover:text-teal-700 font-medium"
                              disabled={loading}
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>
                      </form>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-6">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">Security Tips</p>
                          <ul className="text-blue-700 text-xs space-y-1">
                            <li>• OTP valid for 5 minutes</li>
                            <li>• Maximum 3 verification attempts</li>
                            <li>• Never share OTP with anyone</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      onClick={switchToRegister}
                      className="font-semibold hover:underline"
                      style={{ color: '#14b8a6' }}
                    >
                      Register here
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-5 animate-slideIn">
                {/* Name Field */}
                <div>
                  <label htmlFor="register-name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="register-name"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    placeholder="Enter your full name"
                    disabled={loading}
                    className={`w-full px-5 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-400 ${
                      errors.name ? 'border-red-400' : 'border-gray-200'
                    } ${loading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    onFocus={(e) => !errors.name && (e.target.style.borderColor = '#14b8a6')}
                    onBlur={(e) => !errors.name && (e.target.style.borderColor = '#cbd5e1')}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5 ml-5">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="register-email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="Enter your email"
                    disabled={loading}
                    className={`w-full px-5 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-400 ${
                      errors.email ? 'border-red-400' : 'border-gray-200'
                    } ${loading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    onFocus={(e) => !errors.email && (e.target.style.borderColor = '#14b8a6')}
                    onBlur={(e) => !errors.email && (e.target.style.borderColor = '#cbd5e1')}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5 ml-5">{errors.email}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1.5 ml-5">
                    Use the same email for Google login later
                  </p>
                </div>

                {/* Phone Number Field */}
                <div>
                  <label htmlFor="register-phone" className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="register-phone"
                      name="phone"
                      value={registerData.phone}
                      onChange={handleRegisterChange}
                      placeholder="Enter 10-digit phone number"
                      disabled={loading}
                      className={`w-full pl-16 pr-5 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-400 ${
                        errors.phone ? 'border-red-400' : 'border-gray-200'
                      } ${loading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      onFocus={(e) => !errors.phone && (e.target.style.borderColor = '#14b8a6')}
                      onBlur={(e) => !errors.phone && (e.target.style.borderColor = '#cbd5e1')}
                      required
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1.5 ml-5">{errors.phone}</p>
                  )}
                </div>

                {/* Role Selection */}
                <div className="pt-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    I am registering as:
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start cursor-pointer group">
                      <input
                        type="radio"
                        name="role"
                        value="PARENT"
                        checked={registerData.role === 'PARENT'}
                        onChange={handleRegisterChange}
                        disabled={loading}
                        className="w-5 h-5 border-2 border-gray-300 cursor-pointer mt-0.5"
                        style={{ accentColor: '#14b8a6' }}
                      />
                      <div className="ml-3">
                        <span className="text-gray-900 font-medium group-hover:text-gray-700 transition-colors">
                          Parent/Student
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Looking for tutoring services
                        </p>
                      </div>
                    </label>
                    <label className="flex items-start cursor-pointer group">
                      <input
                        type="radio"
                        name="role"
                        value="TUTOR"
                        checked={registerData.role === 'TUTOR'}
                        onChange={handleRegisterChange}
                        disabled={loading}
                        className="w-5 h-5 border-2 border-gray-300 cursor-pointer mt-0.5"
                        style={{ accentColor: '#14b8a6' }}
                      />
                      <div className="ml-3">
                        <span className="text-gray-900 font-medium group-hover:text-gray-700 transition-colors">
                          Tutor
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Want to offer tutoring services
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#14b8a6' }}
                  onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0d9488')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#14b8a6')}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={switchToLogin}
                      className="font-semibold hover:underline"
                      style={{ color: '#14b8a6' }}
                    >
                      Login here
                    </button>
                  </p>
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  By registering, you agree to our{' '}
                  <a href="#" className="hover:underline" style={{ color: '#14b8a6' }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="hover:underline" style={{ color: '#14b8a6' }}>Privacy Policy</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
