import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onOpenLogin, onOpenRegister, onNavigateToFindTutor, onNavigateToProfile, onNavigateToAdminBooking, onNavigateToAdminDashboard, onNavigateToTutorPool, onNavigateHome, currentPage = 'home' }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const handleLogoClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <button onClick={handleLogoClick} className="flex items-center space-x-2 cursor-pointer group">
              <div className="relative">
                <span className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                  GyaanSetu
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-teal-400 group-hover:w-full transition-all duration-300"></div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation - Role-based rendering */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center px-8">
            {/* Find Tutors - Available for PARENT and guests */}
            {onNavigateToFindTutor && (!user?.role || user?.role === 'PARENT') && (
              <button
                onClick={onNavigateToFindTutor}
                className={`text-gray-700 font-medium transition-all duration-300 cursor-pointer whitespace-nowrap relative group ${
                  currentPage === 'find-tutor' 
                    ? 'font-semibold text-teal-600' 
                    : 'hover:text-teal-600'
                }`}
              >
                Find Tutors
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-300 ${
                  currentPage === 'find-tutor' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            )}
            
            {/* Admin Booking - Available only for ADMIN */}
            {onNavigateToAdminBooking && user?.role === 'ADMIN' && (
              <button
                onClick={onNavigateToAdminBooking}
                className={`text-gray-700 font-medium transition-all duration-300 cursor-pointer whitespace-nowrap relative group ${
                  currentPage === 'admin-booking' 
                    ? 'font-semibold text-teal-600' 
                    : 'hover:text-teal-600'
                }`}
              >
                Admin Booking
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-300 ${
                  currentPage === 'admin-booking' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            )}
            
            {/* Admin Dashboard - Available only for ADMIN */}
            {onNavigateToAdminDashboard && user?.role === 'ADMIN' && (
              <button
                onClick={onNavigateToAdminDashboard}
                className={`text-gray-700 font-medium transition-all duration-300 cursor-pointer whitespace-nowrap relative group ${
                  currentPage === 'admin-dashboard' 
                    ? 'font-semibold text-teal-600' 
                    : 'hover:text-teal-600'
                }`}
              >
                Admin Dashboard
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-300 ${
                  currentPage === 'admin-dashboard' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            )}
            
            {/* Tutor Pool - Available only for TUTOR */}
            {onNavigateToTutorPool && user?.role === 'TUTOR' && (
              <button
                onClick={onNavigateToTutorPool}
                className={`text-gray-700 font-medium transition-all duration-300 cursor-pointer whitespace-nowrap relative group ${
                  currentPage === 'tutor-pool' 
                    ? 'font-semibold text-teal-600' 
                    : 'hover:text-teal-600'
                }`}
              >
                Tutor Pool
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-300 ${
                  currentPage === 'tutor-pool' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            )}
          </div>

          {/* Right side buttons */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            {isAuthenticated() ? (
              <>
                {onNavigateToProfile && (
                  <button
                    onClick={onNavigateToProfile}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap group ${
                      currentPage === 'profile'
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-teal-600 hover:to-cyan-600 hover:text-white hover:shadow-lg hover:shadow-teal-500/30'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenLogin}
                  className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200"
                >
                  Login
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-full hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 bg-white/95 backdrop-blur-lg">
            <div className="flex flex-col space-y-2 px-2">
              {/* Find Tutors - Available for PARENT and guests */}
              {onNavigateToFindTutor && (!user?.role || user?.role === 'PARENT') && (
                <button
                  onClick={() => {
                    onNavigateToFindTutor();
                    setIsMenuOpen(false);
                  }}
                  className={`group flex items-center gap-3 py-3 px-4 transition-all duration-300 text-left cursor-pointer rounded-xl relative overflow-hidden ${
                    currentPage === 'find-tutor' 
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30 font-semibold' 
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-teal-50 hover:to-cyan-50 text-gray-700 hover:text-teal-600 font-medium border border-gray-200 hover:border-teal-200 hover:shadow-md'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="flex-1">Find Tutors</span>
                  <svg className={`w-4 h-4 transition-transform duration-300 ${currentPage === 'find-tutor' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              
              {/* Admin Booking - Available only for ADMIN */}
              {onNavigateToAdminBooking && user?.role === 'ADMIN' && (
                <button
                  onClick={() => {
                    onNavigateToAdminBooking();
                    setIsMenuOpen(false);
                  }}
                  className={`group flex items-center gap-3 py-3 px-4 transition-all duration-300 text-left cursor-pointer rounded-xl relative overflow-hidden ${
                    currentPage === 'admin-booking' 
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30 font-semibold' 
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-teal-50 hover:to-cyan-50 text-gray-700 hover:text-teal-600 font-medium border border-gray-200 hover:border-teal-200 hover:shadow-md'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="flex-1">Admin Booking</span>
                  <svg className={`w-4 h-4 transition-transform duration-300 ${currentPage === 'admin-booking' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              
              {/* Admin Dashboard - Available only for ADMIN */}
              {onNavigateToAdminDashboard && user?.role === 'ADMIN' && (
                <button
                  onClick={() => {
                    onNavigateToAdminDashboard();
                    setIsMenuOpen(false);
                  }}
                  className={`group flex items-center gap-3 py-3 px-4 transition-all duration-300 text-left cursor-pointer rounded-xl relative overflow-hidden ${
                    currentPage === 'admin-dashboard' 
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30 font-semibold' 
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-teal-50 hover:to-cyan-50 text-gray-700 hover:text-teal-600 font-medium border border-gray-200 hover:border-teal-200 hover:shadow-md'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="flex-1">Admin Dashboard</span>
                  <svg className={`w-4 h-4 transition-transform duration-300 ${currentPage === 'admin-dashboard' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              
              {/* Tutor Pool - Available only for TUTOR */}
              {onNavigateToTutorPool && user?.role === 'TUTOR' && (
                <button
                  onClick={() => {
                    onNavigateToTutorPool();
                    setIsMenuOpen(false);
                  }}
                  className={`group flex items-center gap-3 py-3 px-4 transition-all duration-300 text-left cursor-pointer rounded-xl relative overflow-hidden ${
                    currentPage === 'tutor-pool' 
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30 font-semibold' 
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-teal-50 hover:to-cyan-50 text-gray-700 hover:text-teal-600 font-medium border border-gray-200 hover:border-teal-200 hover:shadow-md'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="flex-1">Tutor Pool</span>
                  <svg className={`w-4 h-4 transition-transform duration-300 ${currentPage === 'tutor-pool' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              
              {/* Mobile Auth Section */}
              <div className="pt-3 mt-3 border-t border-gray-200">
                {isAuthenticated() ? (
                  <>
                    {onNavigateToProfile && (
                      <button
                        onClick={() => {
                          onNavigateToProfile();
                          setIsMenuOpen(false);
                        }}
                        className={`px-6 py-3 font-semibold rounded-xl transition-all duration-300 w-full flex items-center justify-center gap-2 shadow-lg mb-2 ${
                          currentPage === 'profile'
                            ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-teal-500/30'
                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-teal-600 hover:to-cyan-600 hover:text-white hover:shadow-teal-500/30'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </button>
                    )}

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 hover:shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onOpenLogin();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 text-center shadow-md border-2 border-gray-300 hover:border-teal-400 mb-2"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        onOpenRegister();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 text-center shadow-lg shadow-teal-500/30 hover:shadow-xl"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
