import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import adminDashboardService from '../services/adminDashboardService';

const AdminDashboardPage = ({ onOpenLogin, onOpenRegister, onNavigateToFindTutor, onNavigateToProfile, onNavigateToAdminBooking, onNavigateToAdminDashboard, onNavigateToTutorPool, onNavigateHome }) => {
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();
  const [activeTab, setActiveTab] = useState('tutor-pool'); // 'tutor-pool' or 'direct-booking'
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'completed', 'cancelled'
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'price-desc', 'price-asc'

  // State for real data from backend
  const [tutorPoolBookings, setTutorPoolBookings] = useState([]);
  const [directBookings, setDirectBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch dashboard data on component mount and when filters change
  useEffect(() => {
    fetchDashboardData();
  }, [activeTab, statusFilter]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch stats
      const statsResponse = await adminDashboardService.getStats();
            if (statsResponse && statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Map frontend status to backend status for tutor pool events
      const mapStatusToBackend = (status) => {
        const mapping = {
          'pending': 'NEW',
          'confirmed': 'FILLED',
          'completed': 'COMPLETED',
          'cancelled': 'CANCELLED'
        };
        return mapping[status] || status.toUpperCase();
      };

      // Map backend status to frontend status for display
      const mapStatusFromBackend = (status) => {
        const mapping = {
          'NEW': 'pending',
          'FILLED': 'confirmed',
          'COMPLETED': 'completed',
          'CANCELLED': 'cancelled'
        };
        return mapping[status] || status.toLowerCase();
      };

      // Fetch tutor pool events or direct bookings based on active tab
      if (activeTab === 'tutor-pool') {
        const params = statusFilter !== 'all' ? { status: mapStatusToBackend(statusFilter) } : {};
        const eventsResponse = await adminDashboardService.getTutorPoolEvents(params);
                                
        if (eventsResponse && eventsResponse.success && eventsResponse.data) {
          // Transform backend data to match frontend structure
          const transformedEvents = eventsResponse.data.map(event => ({
            ...event,
            status: mapStatusFromBackend(event.status) // NEW->pending, FILLED->confirmed, etc
          }));
          setTutorPoolBookings(transformedEvents);
        }
      } else {
        const params = statusFilter !== 'all' ? { status: statusFilter.toUpperCase() } : {};
        const bookingsResponse = await adminDashboardService.getDirectBookings(params);

        if (bookingsResponse && bookingsResponse.success && bookingsResponse.data) {
          // Transform backend data to match frontend structure (status already in correct format)
          const transformedBookings = bookingsResponse.data.map(booking => ({
            ...booking,
            status: booking.status.toLowerCase() // PENDING->pending, CONFIRMED->confirmed, etc
          }));
          setDirectBookings(transformedBookings);
        }
      }
    } catch (error) {
      showError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateString);
  };

  // Helper function to check if event is closed (completed or cancelled)
  const isEventClosed = (booking) => {
    const closedStatuses = ['completed', 'cancelled'];
    return closedStatuses.includes(booking.status);
  };

  const handleStatusChange = async (bookingId, newStatus, bookingType) => {
    try {
      if (bookingType === 'tutor-pool') {
        const response = await adminDashboardService.updateTutorPoolEventStatus(bookingId, {
          status: newStatus,
          notes: 'Status updated by admin'
        });
        
        if (response.success) {
          showSuccess(`Event ${bookingId} cancelled successfully!`);
          // Refresh the data to show updated status
          await fetchDashboardData();
        }
      } else {
        const response = await adminDashboardService.updateDirectBookingStatus(bookingId, {
          status: newStatus,
          notes: 'Status updated by admin'
        });
        
        if (response.success) {
          showSuccess(`Booking ${bookingId} cancelled successfully!`);
          await fetchDashboardData();
        }
      }
    } catch (error) {
      showError(error.message || 'Failed to update status');
          }
  };

  const handlePaymentReceived = async (bookingId, bookingType) => {
    try {
      const response = await adminDashboardService.markPaymentReceived(bookingId, bookingType);
      
      if (response.success) {
        showSuccess(`Payment received for booking ${bookingId}! Status updated to completed.`);
        // Refresh the data to show updated status
        await fetchDashboardData();
      }
    } catch (error) {
      showError(error.message || 'Failed to mark payment as received');
          }
  };

  const handleMoveToTutorPool = (booking) => {
    // TODO: API call to create tutor pool event from direct booking
    
    // Extract class from studentClass (e.g., "Class 10" -> ["Class 10"])
    const classes = [booking.studentClass];
    
    // Create a new tutor pool event
    const newTutorPoolEvent = {
      id: `TP${String(tutorPoolBookings.length + 1).padStart(3, '0')}`,
      address: booking.address,
      classes: classes,
      subjects: booking.subjects,
      priceOffered: booking.priceOffered,
      status: 'pending',
      bookedBy: [],
      maxBookings: 3,
      postedBy: 'Admin',
      postedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      notes: `Moved from Direct Booking ${booking.id} - Parent: ${booking.parentName}, Student: ${booking.studentName}`
    };

    showSuccess(`Event moved to Tutor Pool successfully! New Event ID: ${newTutorPoolEvent.id}`);
    showWarning('Note: This is a demo. In production, this will create a new tutor pool event via API.');
    
    // In production, after successful API call:
    // 1. Create new tutor pool event
    // 2. Optionally cancel/archive the direct booking
    // 3. Refresh both lists
    
      };

  const handleApproveBooking = async (bookingId) => {
    try {
      const response = await adminDashboardService.approveDirectBooking(bookingId);
      
      if (response.success) {
        showSuccess(`Booking ${bookingId} approved successfully! SMS will be sent to parent and tutor.`);
        // Refresh the data to show updated status
        await fetchDashboardData();
      }
    } catch (error) {
      showError(error.message || 'Failed to approve booking');
          }
  };

  const handleRejectBooking = async (bookingId) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason || reason.trim() === '') {
      showWarning('Rejection cancelled - reason is required');
      return;
    }

    try {
      const response = await adminDashboardService.rejectDirectBooking(bookingId, reason);
      
      if (response.success) {
        showSuccess(`Booking ${bookingId} rejected successfully! SMS will be sent to parent and tutor.`);
        // Refresh the data to show updated status
        await fetchDashboardData();
      }
    } catch (error) {
      showError(error.message || 'Failed to reject booking');
          }
  };

  const handleTutorClick = (tutor) => {
    setSelectedTutor(tutor);
  };

  const closeTutorModal = () => {
    setSelectedTutor(null);
  };

  const toggleCardExpansion = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  // Filter and sort logic
  const filterAndSortBookings = (bookings) => {
    let filtered = bookings;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(b => {
        const searchLower = searchQuery.toLowerCase();
        return (
          b.id.toLowerCase().includes(searchLower) ||
          b.address.toLowerCase().includes(searchLower) ||
          (b.parentName && b.parentName.toLowerCase().includes(searchLower)) ||
          (b.studentName && b.studentName.toLowerCase().includes(searchLower)) ||
          b.subjects.some(s => s.toLowerCase().includes(searchLower))
        );
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        case 'date-asc':
          return new Date(a.lastUpdated) - new Date(b.lastUpdated);
        case 'price-desc':
          return b.priceOffered - a.priceOffered;
        case 'price-asc':
          return a.priceOffered - b.priceOffered;
        default:
          return 0;
      }
    });

    return sorted;
  };

  const filteredTutorPoolBookings = filterAndSortBookings(tutorPoolBookings);
  const filteredDirectBookings = filterAndSortBookings(directBookings);
  
        
  // Use backend stats if available, otherwise calculate from filtered bookings
  const tutorPoolStats = stats?.tutorPoolStats || {
    total: tutorPoolBookings.length,
    pending: tutorPoolBookings.filter(b => b.status === 'pending').length,
    confirmed: tutorPoolBookings.filter(b => b.status === 'confirmed').length,
    completed: tutorPoolBookings.filter(b => b.status === 'completed').length,
    cancelled: tutorPoolBookings.filter(b => b.status === 'cancelled').length,
    revenue: tutorPoolBookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.priceOffered, 0)
  };

  const directBookingStats = stats?.directBookingStats || {
    total: directBookings.length,
    pending: directBookings.filter(b => b.status === 'pending').length,
    confirmed: directBookings.filter(b => b.status === 'confirmed').length,
    completed: directBookings.filter(b => b.status === 'completed').length,
    cancelled: directBookings.filter(b => b.status === 'cancelled').length,
    revenue: directBookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.priceOffered, 0)
  };

  const currentStats = activeTab === 'tutor-pool' ? tutorPoolStats : directBookingStats;
  const totalRevenue = (tutorPoolStats.revenue || 0) + (directBookingStats.revenue || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
        onNavigateToFindTutor={onNavigateToFindTutor}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToAdminBooking={onNavigateToAdminBooking}
        onNavigateToAdminDashboard={onNavigateToAdminDashboard}
        onNavigateToTutorPool={onNavigateToTutorPool}
        onNavigateHome={onNavigateHome}
        currentPage="admin-dashboard"
      />

      <main className="pt-20 pb-12">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-lg text-teal-50">Manage all demo bookings and track performance</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-center">
                  <p className="text-2xl font-bold">{tutorPoolStats.total + directBookingStats.total}</p>
                  <p className="text-xs text-teal-50">Total Bookings</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-center">
                  <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-teal-50">Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('tutor-pool')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                  activeTab === 'tutor-pool'
                    ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                    : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Tutor Pool Bookings
                  <span className="ml-2 px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">
                    {tutorPoolStats.total}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('direct-booking')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                  activeTab === 'direct-booking'
                    ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                    : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Direct Bookings
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                    {directBookingStats.total}
                  </span>
                </div>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="p-4 bg-gray-50 grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-gray-800">{currentStats.total}</p>
                <p className="text-xs text-gray-500 mt-1">Total</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-yellow-600">{currentStats.pending}</p>
                <p className="text-xs text-gray-500 mt-1">Pending</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-blue-600">{currentStats.confirmed}</p>
                <p className="text-xs text-gray-500 mt-1">Confirmed</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-green-600">{currentStats.completed}</p>
                <p className="text-xs text-gray-500 mt-1">Completed</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-red-600">{currentStats.cancelled}</p>
                <p className="text-xs text-gray-500 mt-1">Cancelled</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by ID, address, name, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="date-desc">Latest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          )}

          {/* Bookings Grid */}
          {!isLoading && (
          <div className="space-y-4">
            {activeTab === 'tutor-pool' ? (
              // Tutor Pool Bookings
              filteredTutorPoolBookings.length > 0 ? (
                filteredTutorPoolBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden"
                  >
                    {/* Collapsed View */}
                    <div
                      onClick={() => toggleCardExpansion(booking.id)}
                      className="p-6 cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-lg font-bold text-gray-800">#{booking.id}</span>
                            {getStatusBadge(booking.status)}
                            <span className="text-sm text-gray-500">
                              {booking.bookedBy.length}/{booking.maxBookings} tutors booked
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span className="text-sm text-gray-700">{booking.address}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-lg font-bold text-teal-600">₹{booking.priceOffered}/month</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {booking.classes.map((cls, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                {cls}
                              </span>
                            ))}
                            {booking.subjects.map((subject, idx) => (
                              <span key={idx} className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500 mb-1">Last updated</p>
                          <p className="text-sm font-medium text-gray-700">{formatRelativeDate(booking.lastUpdated)}</p>
                          <button className="mt-2 text-teal-600 hover:text-teal-700 font-medium text-sm">
                            {expandedCard === booking.id ? '▲ Collapse' : '▼ View Details'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded View */}
                    {expandedCard === booking.id && (
                      <div className="border-t bg-gray-50 p-6">
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Booking Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg">
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Booking ID</p>
                              <p className="text-sm font-medium text-gray-800">{booking.id}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Posted By</p>
                              <p className="text-sm font-medium text-gray-800">{booking.postedBy}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Posted At</p>
                              <p className="text-sm font-medium text-gray-800">{formatDate(booking.postedAt)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                              <p className="text-sm font-medium">{getStatusBadge(booking.status)}</p>
                            </div>
                            {booking.notes && (
                              <div className="md:col-span-2">
                                <p className="text-xs text-gray-500 uppercase mb-1">Notes</p>
                                <p className="text-sm font-medium text-gray-800">{booking.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Tutors Who Booked ({booking.bookedBy.length})
                            <span className="text-sm text-gray-500 font-normal ml-2">(Oldest first)</span>
                          </h3>
                          <div className="space-y-3">
                            {booking.bookedBy.map((tutor, index) => (
                              <div key={tutor.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start gap-4">
                                  <img
                                    src={tutor.profilePic}
                                    alt={tutor.name}
                                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <button
                                          onClick={() => handleTutorClick(tutor)}
                                          className="text-lg font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                                        >
                                          {tutor.name}
                                        </button>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                            Booking #{index + 1}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            Booked {formatRelativeDate(tutor.bookedAt)}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                        <span className="text-sm font-semibold text-gray-700">{tutor.rating}</span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">{tutor.qualification}</p>
                                    <p className="text-sm text-gray-500 mt-1">{tutor.experience} experience</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-wrap gap-3">
                          <button
                            onClick={() => handlePaymentReceived(booking.id, 'tutor-pool')}
                            disabled={isEventClosed(booking)}
                            className={`px-4 py-2 rounded-lg transition-all inline-flex items-center gap-2 ${
                              isEventClosed(booking)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                            title={isEventClosed(booking) ? 'Event is already closed' : 'Mark payment as received'}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {booking.status === 'completed' ? 'Payment Received ✓' : 'Mark Payment Received'}
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancelled', 'tutor-pool')}
                            disabled={isEventClosed(booking)}
                            className={`px-4 py-2 rounded-lg transition-all ${
                              isEventClosed(booking)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                            title={isEventClosed(booking) ? 'Event is already closed' : 'Cancel this event'}
                          >
                            {booking.status === 'cancelled' ? 'Cancelled ✗' : 'Cancel Event'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-500 text-lg">No tutor pool bookings found</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                </div>
              )
            ) : (
              // Direct Bookings
              filteredDirectBookings.length > 0 ? (
                filteredDirectBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden"
                  >
                    {/* Collapsed View */}
                    <div
                      onClick={() => toggleCardExpansion(booking.id)}
                      className="p-6 cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-lg font-bold text-gray-800">#{booking.id}</span>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Parent</p>
                              <p className="text-sm font-medium text-gray-800">{booking.parentInfo?.name || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Student</p>
                              <p className="text-sm font-medium text-gray-800">{booking.studentInfo?.name || 'N/A'} ({booking.studentInfo?.className || 'N/A'})</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Tutor</p>
                              <p className="text-sm font-medium text-gray-800">{booking.assignedTutor?.name || 'N/A'}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 mt-3">
                            <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <span className="text-sm text-gray-700">{booking.address}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {booking.subjects.map((subject, idx) => (
                              <span key={idx} className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                                {subject}
                              </span>
                            ))}
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                              ₹{booking.priceOffered}/month
                            </span>
                          </div>
                        </div>

                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500 mb-1">Last updated</p>
                          <p className="text-sm font-medium text-gray-700">{formatRelativeDate(booking.lastUpdated)}</p>
                          <button className="mt-2 text-teal-600 hover:text-teal-700 font-medium text-sm">
                            {expandedCard === booking.id ? '▲ Collapse' : '▼ View Details'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded View */}
                    {expandedCard === booking.id && (
                      <div className="border-t bg-gray-50 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* Parent Details */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Parent Details</h3>
                            <div className="bg-white p-4 rounded-lg space-y-3">
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Name</p>
                                <p className="text-sm font-medium text-gray-800">{booking.parentInfo?.name || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Phone</p>
                                <a href={`tel:${booking.parentInfo?.phone}`} className="text-sm font-medium text-teal-600 hover:text-teal-700">
                                  {booking.parentInfo?.phone || 'N/A'}
                                </a>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Email</p>
                                <a href={`mailto:${booking.parentInfo?.email}`} className="text-sm font-medium text-teal-600 hover:text-teal-700">
                                  {booking.parentInfo?.email || 'N/A'}
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Student Details */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Student Details</h3>
                            <div className="bg-white p-4 rounded-lg space-y-3">
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Name</p>
                                <p className="text-sm font-medium text-gray-800">{booking.studentInfo?.name || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Class</p>
                                <p className="text-sm font-medium text-gray-800">{booking.studentInfo?.className || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Subjects</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {booking.subjects?.map((subject, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                                      {subject}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tutor Details */}
                        {booking.assignedTutor && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Assigned Tutor</h3>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="flex items-start gap-4">
                                {booking.assignedTutor.profileImage ? (
                                  <img
                                    src={booking.assignedTutor.profileImage}
                                    alt={booking.assignedTutor.name}
                                    className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl font-bold text-teal-600">
                                      {booking.assignedTutor.name?.charAt(0) || 'T'}
                                    </span>
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <button
                                        onClick={() => handleTutorClick(booking.assignedTutor)}
                                        className="text-xl font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                                      >
                                        {booking.assignedTutor.name}
                                      </button>
                                      <p className="text-sm text-gray-600 mt-1">{booking.assignedTutor.qualification}</p>
                                      <p className="text-sm text-gray-500 mt-1">{booking.assignedTutor.experience}</p>
                                      <p className="text-sm text-gray-500 mt-1">
                                        <a href={`tel:${booking.assignedTutor.phone}`} className="text-teal-600 hover:text-teal-700">
                                          📞 {booking.assignedTutor.phone}
                                        </a>
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        <a href={`mailto:${booking.assignedTutor.email}`} className="text-teal-600 hover:text-teal-700">
                                          ✉️ {booking.assignedTutor.email}
                                        </a>
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                      </svg>
                                      <span className="text-sm font-semibold text-gray-700">{booking.assignedTutor.rating?.toFixed(1) || '0.0'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Booking Details */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Booking Details</h3>
                          <div className="bg-white p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Booking ID</p>
                              <p className="text-sm font-medium text-gray-800">{booking.id}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                              <p className="text-sm font-medium">{getStatusBadge(booking.status)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Booked At</p>
                              <p className="text-sm font-medium text-gray-800">{formatDate(booking.bookedAt)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Demo Scheduled</p>
                              <p className="text-sm font-medium text-gray-800">{formatDate(booking.demoScheduled)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Preferred Schedule</p>
                              <p className="text-sm font-medium text-gray-800">{booking.preferredSchedule}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Price</p>
                              <p className="text-sm font-bold text-teal-600">₹{booking.priceOffered}/month</p>
                            </div>
                            {booking.notes && (
                              <div className="md:col-span-2">
                                <p className="text-xs text-gray-500 uppercase mb-1">Notes</p>
                                <p className="text-sm font-medium text-gray-800">{booking.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-wrap gap-3">
                          {/* Approve Button - Only for pending status */}
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleApproveBooking(booking.id)}
                              className="px-4 py-2 rounded-lg transition-all inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                              title="Approve this demo request"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approve Demo
                            </button>
                          )}

                          {/* Reject Button - Only for pending status */}
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleRejectBooking(booking.id)}
                              className="px-4 py-2 rounded-lg transition-all inline-flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
                              title="Reject this demo request"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Reject Demo
                            </button>
                          )}

                          {/* Mark Payment Received - For confirmed demos */}
                          <button
                            onClick={() => handlePaymentReceived(booking.id, 'direct')}
                            disabled={isEventClosed(booking)}
                            className={`px-4 py-2 rounded-lg transition-all inline-flex items-center gap-2 ${
                              isEventClosed(booking)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                            title={isEventClosed(booking) ? 'Booking is already closed' : 'Mark payment as received'}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {booking.status === 'completed' ? 'Payment Received ✓' : 'Mark Payment Received'}
                          </button>

                          {/* Cancel Booking */}
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancelled', 'direct')}
                            disabled={isEventClosed(booking)}
                            className={`px-4 py-2 rounded-lg transition-all ${
                              isEventClosed(booking)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-orange-600 text-white hover:bg-orange-700'
                            }`}
                            title={isEventClosed(booking) ? 'Booking is already closed' : 'Cancel this booking'}
                          >
                            {booking.status === 'cancelled' ? 'Cancelled ✗' : 'Cancel Booking'}
                          </button>

                          {/* Call Parent */}
                          <a
                            href={`tel:${booking.parentInfo?.phone}`}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all inline-flex items-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call Parent
                          </a>

                          {/* Call Tutor */}
                          {booking.assignedTutor && (
                            <a
                              href={`tel:${booking.assignedTutor.phone}`}
                              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all inline-flex items-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Call Tutor
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-500 text-lg">No direct bookings found</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                </div>
              )
            )}
          </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Tutor Contact Details Modal */}
      {selectedTutor && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeTutorModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-6 text-white">
              <div className="flex items-center gap-4">
                <img
                  src={selectedTutor.profilePic}
                  alt={selectedTutor.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-bold">{selectedTutor.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="text-lg font-semibold">{selectedTutor.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Qualification</p>
                <p className="text-sm font-medium text-gray-800">{selectedTutor.qualification}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Experience</p>
                <p className="text-sm font-medium text-gray-800">{selectedTutor.experience}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 uppercase mb-3">Contact Details</p>
                <div className="space-y-3">
                  <a
                    href={`tel:${selectedTutor.phone}`}
                    className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-all"
                  >
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-800">{selectedTutor.phone}</span>
                  </a>

                  <a
                    href={`mailto:${selectedTutor.email}`}
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-800">{selectedTutor.email}</span>
                  </a>
                </div>
              </div>

              <button
                onClick={closeTutorModal}
                className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AdminDashboardPage;
