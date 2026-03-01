import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import useToast from '../../hooks/useToast';
import api from '../../services/api';

const OtpLoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errors, setErrors] = useState({});

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

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
      
      // Check if request was successful (response.success from interceptor or direct check)
      if (response.success !== false) {
        showSuccess('OTP sent to your email!');
        setStep('otp');
        setCooldown(60); // Start 60-second cooldown
      } else {
        throw new Error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      const errorMessage = error.message || error.response?.data?.message || 'Failed to send OTP. Please try again.';
      showError(errorMessage);
      setErrors({ email: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    console.log('🚀 [STEP 1] handleVerifyOtp started');
    console.log('📧 Email:', email);
    console.log('🔢 OTP:', otp);
    
    setErrors({});

    if (!otp || otp.length !== 6) {
      console.log('❌ [STEP 2] Validation failed - OTP length issue');
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    console.log('✅ [STEP 2] Validation passed');
    setLoading(true);

    try {
      console.log('📤 [STEP 3] Sending API request to /api/auth/otp/verify');
      console.log('Request payload:', { email, otp });
      
      const response = await api.post('/api/auth/otp/verify', { email, otp });
      
      console.log('📥 [STEP 4] API response received');
      console.log('=== FULL RESPONSE OBJECT ===');
      console.log('Type of response:', typeof response);
      console.log('Response keys:', Object.keys(response));
      console.log('response:', response);
      console.log('response.data:', response.data);
      console.log('response.data type:', typeof response.data);
      console.log('response.success:', response.success);
      console.log('response.message:', response.message);
      console.log('response.apiResponse:', response.apiResponse);
      console.log('response.status:', response.status);
      console.log('response.statusText:', response.statusText);
      console.log('===========================');
      
      console.log('🔍 [STEP 5] Extracting login data');
      const loginData = response.data;
      
      console.log('loginData:', loginData);
      console.log('loginData type:', typeof loginData);
      console.log('loginData keys:', loginData ? Object.keys(loginData) : 'NULL');
      console.log('loginData.token:', loginData?.token);
      console.log('loginData.user:', loginData?.user);
      
      console.log('🔐 [STEP 6] Checking token existence');
      console.log('loginData exists?', !!loginData);
      console.log('loginData.token exists?', !!loginData?.token);
      console.log('Condition check (loginData?.token):', !!loginData?.token);
      
      if (!loginData?.token) {
        throw new Error(response.message || 'Invalid OTP - no token received');
      }
      
      // Token exists, proceed with login
      console.log('✅ [STEP 7] Token found! Proceeding with login');
      console.log('Token value:', loginData.token);
      console.log('User data:', loginData.user);
      
      showSuccess('Login successful!');
      
      console.log('💾 [STEP 8] Storing token in localStorage');
      localStorage.setItem('authToken', loginData.token);
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('user', JSON.stringify(loginData.user));
      console.log('✅ LocalStorage updated');
      
      console.log('🔄 [STEP 9] Updating auth context');
      login(loginData.user, loginData.token);
      console.log('✅ Auth context updated');
      
      console.log('🚪 [STEP 10] Redirecting user');
      setTimeout(() => {
        const role = loginData.user.role;
        console.log('User role:', role);
        
        onClose();
        
        if (role === 'ADMIN') {
          console.log('→ Redirecting to /admin-dashboard');
          window.location.href = '/admin-dashboard';
        } else if (role === 'TUTOR') {
          console.log('→ Redirecting to /tutor-profile');
          window.location.href = '/tutor-profile';
        } else {
          console.log('→ Redirecting to /find-tutor');
          window.location.href = '/find-tutor';
        }
      }, 1000);
    } catch (error) {
      console.error('💥 [ERROR HANDLER] Exception caught');
      console.error('=== ERROR DETAILS ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error response:', error.response);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      console.error('Error response message:', error.response?.data?.message);
      console.error('====================');
      
      const errorMessage = error.response?.message || error.message || 'Invalid OTP. Please try again.';
      console.error('📢 Final error message shown to user:', errorMessage);
      
      showError(errorMessage);
      setErrors({ otp: errorMessage });
    } finally {
      console.log('🏁 [FINALLY] Setting loading to false');
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp('');
    setErrors({});
    await handleSendOtp({ preventDefault: () => {} });
  };

  const handleBack = () => {
    setStep('email');
    setOtp('');
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slideUp">
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
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {step === 'email' ? 'Login with OTP v2' : 'Enter OTP v2'}
              </h2>
              <p className="text-gray-600">
                {step === 'email' 
                  ? 'Enter your email to receive a one-time password' 
                  : `We sent a 6-digit code to ${email}`}
              </p>
            </div>

            {/* Email Step */}
            {step === 'email' && (
              <form onSubmit={handleSendOtp}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({});
                    }}
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.email ? 'border-red-400' : 'border-gray-200'
                    }`}
                    onFocus={(e) => !errors.email && (e.target.style.borderColor = '#14b8a6')}
                    onBlur={(e) => !errors.email && (e.target.style.borderColor = '#e5e7eb')}
                    required
                    autoFocus
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
              </form>
            )}

            {/* OTP Step */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-6">
                  <label htmlFor="otp" className="block text-sm font-semibold text-gray-900 mb-2">
                    Enter 6-Digit OTP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                      if (errors.otp) setErrors({});
                    }}
                    placeholder="123456"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-center text-2xl font-mono tracking-widest ${
                      errors.otp ? 'border-red-400' : 'border-gray-200'
                    }`}
                    onFocus={(e) => !errors.otp && (e.target.style.borderColor = '#14b8a6')}
                    onBlur={(e) => !errors.otp && (e.target.style.borderColor = '#e5e7eb')}
                    required
                    autoFocus
                    maxLength={6}
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-1.5">{errors.otp}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4"
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
                    onClick={handleBack}
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
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Security Tips</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• OTP valid for 5 minutes</li>
                    <li>• Maximum 3 verification attempts</li>
                    <li>• Never share OTP with anyone</li>
                    <li>• Request new OTP after 60 seconds</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-4 right-4 z-[110] px-6 py-4 rounded-xl shadow-2xl animate-slideIn ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-semibold`}>
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default OtpLoginModal;
