import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import tutorPoolService from '../services/tutorPoolService';

const TutorPoolPage = ({ onOpenLogin, onOpenRegister, onNavigateToFindTutor, onNavigateToProfile, onNavigateToAdminBooking, onNavigateToAdminDashboard, onNavigateHome }) => {
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();
  const { user, isAuthenticated, hasRole } = useAuth();
  const [demoEvents, setDemoEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTutorProfileId, setCurrentTutorProfileId] = useState(null);

  const userRole = user?.role || 'TUTOR';
  const currentTutorName = user?.name || 'Guest';

  // Fetch current tutor's profile ID on mount (for TUTOR role only)
  useEffect(() => {
    const fetchTutorProfile = async () => {
      if (hasRole('TUTOR') && isAuthenticated() && user?.id) {
        try {
          // The user ID is stored in localStorage, we need to get the TutorProfile ID
          // We can extract it from the booked events after they load, or store it in user object
          // For now, we'll use the user.profileId if available
          if (user.profileId) {
            setCurrentTutorProfileId(user.profileId);
          }
        } catch (err) {
                  }
      }
    };
    
    fetchTutorProfile();
  }, [user?.id]);

  // Fetch events on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      showError('Please login to access Tutor Pool');
      return;
    }

    fetchEvents();
  }, [user?.role]);

  // Helper function to check if current tutor booked an event
  const hasBookedEvent = (event) => {
    // If we have the profile ID, use it for accurate checking
    if (currentTutorProfileId && event.bookedTutorIds) {
      return event.bookedTutorIds.includes(currentTutorProfileId);
    }
    // Fallback to name-based checking (less accurate but works if profileId not available)
    return event.bookedBy.includes(currentTutorName);
  };

  // Helper function to check if event is closed (completed, cancelled, or expired)
  const isEventClosed = (event) => {
    return ['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(event.status);
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let response;
      
      // Fetch based on user role
      if (hasRole('ADMIN')) {
        response = await tutorPoolService.getAllEvents();
      } else if (hasRole('TUTOR')) {
        response = await tutorPoolService.getAvailableEvents();
      } else {
        showError('Access denied. Only tutors and admins can access this page.');
        setIsLoading(false);
        return;
      }

      // Check if response is valid (using same pattern as AdminDemoBookingPage)
      if (response && response.success !== false && response.data) {
        // Map backend response to frontend structure
        const mappedEvents = response.data.map((event) => ({
          id: event.id,
          address: event.address,
          classes: event.classLevelNames || event.classLevels || [],
          subjects: event.subjectNames || event.subjects || [],
          priceOffered: event.pricePerMonth || event.priceOffered || 0,
          status: event.status || 'PENDING',
          bookedBy: event.bookedTutors?.map(t => t.tutorName) || [], // Array of tutor names
          bookedTutorIds: event.bookedTutors?.map(t => t.tutorId) || [], // Array of tutor IDs for checking
          bookedTutorsCount: event.bookedTutorsCount || event.bookedTutors?.length || 0,
          maxBookings: 3, // Default max bookings
          postedBy: 'Admin',
          postedAt: event.createdAt || new Date().toISOString(),
        }));

        setDemoEvents(mappedEvents);
      } else {
        setError(response.error || 'Failed to load events');
        showError(response.error || 'Failed to load events');
      }
    } catch (err) {
            setError('Failed to load tutor pool events');
      showError('Failed to load tutor pool events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookDemo = async (eventId) => {
    const event = demoEvents.find(e => e.id === eventId);
    
    if (!event) return;

    // Check if event is closed (completed, cancelled, or expired)
    if (isEventClosed(event)) {
      showError('This event is no longer available for booking');
      return;
    }

    if (event.status === 'BOOKED' || event.status === 'FILLED') {
      showError('This event is already fully booked');
      return;
    }

    if (event.bookedBy.length >= event.maxBookings) {
      showError('Maximum bookings reached for this event');
      return;
    }

    // Check if tutor already booked this event
    if (hasBookedEvent(event)) {
      showError('You have already booked this event');
      return;
    }

    try {
      const response = await tutorPoolService.bookEvent(eventId);
            
      // Use same pattern as other successful API calls
      if (response && response.success !== false) {
        // Refresh events after successful booking
        await fetchEvents();
        showSuccess(response.message || 'Demo booked successfully! Admin will contact you soon.', 4000);
      } else {
        showError(response.error || response.message || 'Failed to book event');
      }
    } catch (error) {
            // Check if it's a duplicate booking error (already booked)
      if (error.message && error.message.includes('already booked')) {
        showWarning('You have already booked this event');
        // Refresh to show updated state
        await fetchEvents();
      } else {
        showError(error.message || 'Failed to book event. Please try again.');
      }
    }
  };

  const handleCancelBooking = async (eventId) => {
    const event = demoEvents.find(e => e.id === eventId);
    
    if (!event) return;

    // Check if tutor has booked this event
    if (!hasBookedEvent(event)) {
      showError('You have not booked this event');
      return;
    }

    try {
      const response = await tutorPoolService.cancelBooking(eventId);
            
      // Use same pattern as other successful API calls
      if (response && response.success !== false) {
        // Refresh events after successful cancellation
        await fetchEvents();
        showSuccess(response.message || 'Booking cancelled successfully!', 3000);
      } else {
        showError(response.error || response.message || 'Failed to cancel booking');
      }
    } catch (error) {
            showError(error.message || 'Failed to cancel booking. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      NEW: 'bg-blue-100 text-blue-800 border-blue-300',
      FILLED: 'bg-green-100 text-green-800 border-green-300',
      BOOKED: 'bg-green-100 text-green-800 border-green-300',
      COMPLETED: 'bg-purple-100 text-purple-800 border-purple-300',
      CANCELLED: 'bg-red-100 text-red-800 border-red-300',
      EXPIRED: 'bg-gray-100 text-gray-800 border-gray-300',
    };

    const labels = {
      PENDING: 'PENDING',
      NEW: 'OPEN',
      FILLED: 'FILLED',
      BOOKED: 'BOOKED',
      COMPLETED: 'COMPLETED',
      CANCELLED: 'CANCELLED',
      EXPIRED: 'EXPIRED',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.PENDING}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <Navbar
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
        onNavigateToFindTutor={onNavigateToFindTutor}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToAdminBooking={onNavigateToAdminBooking}
        onNavigateToAdminDashboard={onNavigateToAdminDashboard}
        onNavigateHome={onNavigateHome}
        currentPage="tutor-pool"
      />

      <main className="pt-20">
        {/* Modern Hero Section */}
        <div className="relative py-16 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fadeIn">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-full shadow-sm mb-4 border border-teal-100">
                <span className="text-teal-600 font-semibold text-sm">🎯 {hasRole('ADMIN') ? 'All Demo Events' : 'Available Opportunities'}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Tutor <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Demo Pool</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {hasRole('ADMIN') 
                  ? 'Manage all demo bookings and track tutor assignments'
                  : 'Browse and book demo opportunities to expand your teaching reach'
                }
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-slideUp">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{demoEvents.filter(e => !isEventClosed(e) && !hasBookedEvent(e)).length}</p>
                <p className="text-gray-600 font-medium">Available Events</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{demoEvents.filter(e => hasBookedEvent(e) && !isEventClosed(e)).length}</p>
                <p className="text-gray-600 font-medium">Your Bookings</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{demoEvents.length}</p>
                <p className="text-gray-600 font-medium">Total Events</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-5 mb-8 rounded-r-2xl shadow-sm animate-slideUp">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-900 mb-2">💡 How it works</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {userRole === 'ADMIN'
                    ? 'Post demo requests for tutors to view. Each event can be booked by up to 3 tutors. Manage bookings manually after tutors express interest.'
                    : 'Browse demo opportunities posted by admin. Book events you\'re interested in (max 3 tutors per event). Admin will contact you for the next steps.'}
                </p>
              </div>
            </div>
          </div>

          {/* Demo Events List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Demo Requests</h2>
              <span className="px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 rounded-full text-sm font-semibold border border-teal-200">
                {demoEvents.filter(e => ['PENDING', 'NEW', 'FILLED'].includes(e.status)).length} Active
              </span>
            </div>
            
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-teal-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading events...</h3>
                <p className="text-gray-600">Please wait while we fetch the latest demo requests</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load events</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchEvents}
                  className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : demoEvents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No demo requests yet</h3>
                <p className="text-gray-600">Check back later for new opportunities</p>
              </div>
            ) : (
              demoEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-l-4 border-teal-500 hover:-translate-y-1"
                >
                  {/* Event Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Posted by {event.postedBy}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(event.postedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(event.status)}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Address */}
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                        <p className="text-sm font-medium text-gray-800">{event.address}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Price Offered</p>
                        <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">₹{event.priceOffered}/month</p>
                      </div>
                    </div>

                    {/* Classes */}
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl border border-purple-200 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Classes</p>
                        <div className="flex flex-wrap gap-1.5">
                          {event.classes.map((cls, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 rounded-lg text-xs font-semibold border border-purple-200 hover:scale-105 transition-transform">
                              {cls}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Subjects */}
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl border border-orange-200 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Subjects</p>
                        <div className="flex flex-wrap gap-1.5">
                          {event.subjects.map((subject, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-lg text-xs font-semibold border border-orange-200 hover:scale-105 transition-transform">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Info & Action */}
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-xl border border-gray-200">
                          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-700">
                            <span className="text-teal-600">{event.bookedBy.length}</span> / {event.maxBookings} slots
                          </span>
                        </div>
                        {event.bookedBy.length > 0 && (
                          <div className="text-xs text-gray-500 font-medium">
                            📋 Booked by: <span className="text-gray-700">{event.bookedBy.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {userRole === 'TUTOR' && (
                        <div>
                          {hasBookedEvent(event) ? (
                            // Cancel button if tutor has already booked
                            <button
                              onClick={() => handleCancelBooking(event.id)}
                              disabled={isEventClosed(event)}
                              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                                !isEventClosed(event)
                                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {isEventClosed(event) ? '🔒 Event Closed' : '❌ Cancel Booking'}
                            </button>
                          ) : (
                            // Book button if tutor hasn't booked yet
                            <button
                              onClick={() => handleBookDemo(event.id)}
                              disabled={isEventClosed(event) || !['PENDING', 'NEW', 'FILLED'].includes(event.status) || event.bookedBy.length >= event.maxBookings}
                              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                                !isEventClosed(event) && ['PENDING', 'NEW', 'FILLED'].includes(event.status) && event.bookedBy.length < event.maxBookings
                                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {isEventClosed(event) 
                                ? event.status === 'COMPLETED' ? '✅ Payment Received' 
                                  : event.status === 'CANCELLED' ? '🚫 Event Cancelled' 
                                  : '⏰ Expired'
                                : event.bookedBy.length >= event.maxBookings 
                                  ? '🎯 Fully Booked' 
                                  : '📚 Book Demo'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
    </div>
  );
};

export default TutorPoolPage;
