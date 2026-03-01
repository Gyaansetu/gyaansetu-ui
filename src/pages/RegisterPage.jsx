import { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
        // Add your registration logic here
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=1000&fit=crop"
          alt="Students learning"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/80 to-primary-800/80 flex items-end p-12">
          <div className="text-white">
            <h2 className="text-5xl font-bold mb-4">Join GyaanSetu Today</h2>
            <p className="text-xl text-white/90">Start your learning journey with verified tutors</p>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GyaanSetu!</h1>
          </div>

          {/* Tab Buttons */}
          <div className="flex mb-8 bg-primary-100 rounded-full p-1">
            <Link
              to="/login"
              className="flex-1 py-3 text-center rounded-full font-semibold transition-all text-gray-600 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex-1 py-3 text-center rounded-full font-semibold transition-all bg-primary-500 text-white shadow-md"
            >
              Register
            </Link>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-center mb-8">
            Create your account and get access to thousands of qualified tutors in your area.
          </p>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your Email Address"
                className="w-full px-6 py-3.5 border-2 border-primary-200 rounded-full focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-400"
                required
              />
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-2">
                User name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your User name"
                className="w-full px-6 py-3.5 border-2 border-primary-200 rounded-full focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-400"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your Password"
                  className="w-full px-6 py-3.5 border-2 border-primary-200 rounded-full focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-400 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl mt-8"
              style={{ backgroundColor: '#14b8a6' }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#0d9488')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#14b8a6')}
            >
              Register
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
