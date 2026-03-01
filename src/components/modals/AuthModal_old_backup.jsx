import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import useToast from '../../hooks/useToast';
import Toast from '../common/Toast';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, sendOtp } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  const [mode, setMode] = useState(initialMode);
  const [loginData, setLoginData] = useState({
    phone: '',
    otp: '',
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'PARENT',
    // Tutor-specific fields
    gender: '',
    qualification: '',
    experience: '',
    profileSummary: '',
    location: {
      houseNo: '',
      area: '',
      city: '',
      state: ''
    }
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Update mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // OTP Timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

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

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    // Only allow digits for phone and OTP
    if ((name === 'phone' || name === 'otp') && value && !/^\d*$/.test(value)) {
      return;
    }
    // Limit phone to 10 digits
    if (name === 'phone' && value.length > 10) {
      return;
    }
    // Limit OTP to 6 digits
    if (name === 'otp' && value.length > 6) {
      return;
    }
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
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
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSendOTP = async (e) => {
    e?.preventDefault();
    const newErrors = {};

    if (!loginData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(loginData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await sendOtp(loginData.phone);
    setLoading(false);

    if (result.success) {
      setOtpSent(true);
      setOtpTimer(30);
      showSuccess('OTP sent successfully!');
    } else {
      // Check if error indicates account not found
      const errorMessage = result.error || 'Failed to send OTP';
       // Debug log
      if (errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('register')) {
        showError(errorMessage);
        // Automatically switch to register mode after 1.5 seconds
        setTimeout(() => {
          switchToRegister();
        }, 1500);
      } else {
        showError(errorMessage);
      }
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    await handleSendOTP();
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpSent) {
      await handleSendOTP(e);
      return;
    }

    const newErrors = {};
    if (!loginData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (loginData.otp.length !== 6) {
      newErrors.otp = 'Please enter a valid 6-digit OTP';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await login(loginData.phone, loginData.otp);
    setLoading(false);

    if (result.success) {
      showSuccess('Login successful! Welcome back!');
      // Reset form state
      setLoginData({ phone: '', otp: '' });
      setOtpSent(false);
      setErrors({});
      // Close modal smoothly after a brief delay to show success message
      setTimeout(() => {
        onClose();
      }, 800);
    } else {
      showError(result.error || 'Login failed');
    }
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

    // Prepare clean registration data (only send required fields)
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
      showSuccess('Registration successful! Please login with OTP.');
      // Pre-fill phone number in login form
      setLoginData({ phone: registerData.phone, otp: '' });
      // Reset registration form
      setRegisterData({ name: '', email: '', phone: '', role: 'PARENT' });
      setErrors({});
      // Smoothly switch to login mode after brief delay
      setTimeout(() => {
        setMode('login');
      }, 800);
    } else {
      showError(result.error || 'Registration failed');
    }
  };

  const switchToRegister = () => {
    setOtpSent(false);
    setOtpTimer(0);
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
              {mode === 'login' ? 'Login to continue to GyaanSetu' : 'Create your account to get started'}
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

          {/* Forms Container with smooth transition */}
          <div className="relative overflow-hidden">
            <div 
              className="transition-all duration-500 ease-in-out"
              style={{
                transform: mode === 'login' ? 'translateX(0%)' : 'translateX(-100%)',
              }}
            >
              <div className="flex">
                {/* Login Form */}
                <div className="w-full flex-shrink-0">
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    {/* Phone Number Field */}
                    <div>
                      <label htmlFor="login-phone" className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                          +91
                        </span>
                        <input
                          type="tel"
                          id="login-phone"
                          name="phone"
                          value={loginData.phone}
                          onChange={handleLoginChange}
                          placeholder="Enter 10-digit phone number"
                          disabled={otpSent}
                          className={`w-full pl-16 pr-5 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-400 ${
                            errors.phone ? 'border-red-400' : 'border-gray-200'
                          } ${otpSent ? 'bg-gray-50' : ''}`}
                          onFocus={(e) => !errors.phone && (e.target.style.borderColor = '#14b8a6')}
                          onBlur={(e) => !errors.phone && (e.target.style.borderColor = '#cbd5e1')}
                          required
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1.5 ml-5">{errors.phone}</p>
                      )}
                      {otpSent && (
                        <p className="text-green-600 text-xs mt-1.5 ml-5 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          OTP sent successfully!
                        </p>
                      )}
                    </div>

                    {/* OTP Field - Shows after OTP is sent */}
                    {otpSent && (
                      <div className="animate-slideDown">
                        <label htmlFor="login-otp" className="block text-sm font-semibold text-gray-900 mb-2">
                          Enter OTP
                        </label>
                        <input
                          type="tel"
                          id="login-otp"
                          name="otp"
                          value={loginData.otp}
                          onChange={handleLoginChange}
                          placeholder="Enter 6-digit OTP"
                          className={`w-full px-5 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-400 text-center text-lg tracking-widest ${
                            errors.otp ? 'border-red-400' : 'border-gray-200'
                          }`}
                          onFocus={(e) => !errors.otp && (e.target.style.borderColor = '#14b8a6')}
                          onBlur={(e) => !errors.otp && (e.target.style.borderColor = '#cbd5e1')}
                          required
                          autoFocus
                        />
                        {errors.otp && (
                          <p className="text-red-500 text-xs mt-1.5 ml-5">{errors.otp}</p>
                        )}
                        <div className="flex items-center justify-between mt-3 text-sm">
                          <span className="text-gray-600">Didn't receive OTP?</span>
                          {otpTimer > 0 ? (
                            <span className="text-gray-500">Resend in {otpTimer}s</span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOTP}
                              className="font-semibold transition-colors"
                              style={{ color: '#14b8a6' }}
                              onMouseEnter={(e) => (e.target.style.color = '#0d9488')}
                              onMouseLeave={(e) => (e.target.style.color = '#14b8a6')}
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Login/Send OTP Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#14b8a6' }}
                      onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0d9488')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = '#14b8a6')}
                    >
                      {loading ? 'Processing...' : (otpSent ? 'Verify OTP & Login' : 'Send OTP')}
                    </button>

                    {/* Change Number - Shows after OTP is sent */}
                    {otpSent && (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpTimer(0);
                          setLoginData({ phone: '', otp: '' });
                          setErrors({});
                        }}
                        className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                      >
                        Change Phone Number
                      </button>
                    )}
                  </form>
                </div>

                {/* Register Form */}
                <div className="w-full flex-shrink-0">
                  <form onSubmit={handleRegisterSubmit} className="space-y-5">
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
                        Email Address
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

                    {/* Terms */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                      By registering, you agree to our{' '}
                      <a href="#" className="hover:underline" style={{ color: '#14b8a6' }}>Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="hover:underline" style={{ color: '#14b8a6' }}>Privacy Policy</a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
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
        @keyframes slideDown {
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
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
