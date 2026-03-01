import { useState, useEffect } from 'react';
import api from '../../services/api';

const TutorDemoDashboard = () => {
  const [demoRequests, setDemoRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('demoDate');

  useEffect(() => {
    fetchDemoRequests();
  }, [selectedStatus, sortBy]);

  const fetchDemoRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
            const response = await api.get('/api/demos/my', {
        params: {
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          sortBy: sortBy
        }
      });
            setDemoRequests(response.data || []);
    } catch (err) {
            setError(err.message || 'Failed to fetch demo requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (demoId, action) => {
    try {
            await api.post(`/api/demos/${demoId}/action`, {
        action: action
      });
            fetchDemoRequests(); // Refresh the list
    } catch (err) {
            alert('Failed to perform action. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pending',
        icon: '⏳'
      },
      REQUESTED: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pending',
        icon: '⏳'
      },
      ACCEPTED: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Accepted',
        icon: '✅'
      },
      REJECTED: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Rejected',
        icon: '❌'
      },
      COMPLETED: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Completed',
        icon: '🎉'
      }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    // If it's already in 12-hour format (contains AM/PM), return as is
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    // Otherwise, convert from 24-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'Not specified';
    const date = formatDate(dateString);
    const time = formatTime(timeString);
    return `${date} at ${time}`;
  };

  const stats = {
    total: demoRequests.length,
    pending: demoRequests.filter(d => d.status === 'PENDING').length,
    accepted: demoRequests.filter(d => d.status === 'ACCEPTED').length,
    completed: demoRequests.filter(d => d.status === 'COMPLETED').length,
    rejected: demoRequests.filter(d => d.status === 'REJECTED').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading demo requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Demo Bookings Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage all your demo requests in one place</p>
        </div>
        <button
          onClick={fetchDemoRequests}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Accepted</p>
              <p className="text-2xl font-bold text-green-900">{stats.accepted}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-purple-900">{stats.completed}</p>
            </div>
            <div className="text-3xl">🎉</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
            </div>
            <div className="text-3xl">❌</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">All Requests</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="demoDate">Demo Date</option>
            <option value="createdAt">Created Date</option>
          </select>
        </div>
      </div>

      {/* Demo Requests List */}
      {demoRequests.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No demo requests found</h3>
          <p className="text-gray-600">
            {selectedStatus !== 'all' 
              ? `No ${selectedStatus.toLowerCase()} demo requests at the moment.`
              : 'You haven\'t received any demo requests yet.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {demoRequests.map((demo) => {
            const demoId = demo.id || demo.demoId || demo.requestId;
            
            return (
            <div
              key={demoId || Math.random()}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header with Request # and Status */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Request #{demoId || 'N/A'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {formatDate(demo.createdAt)}
                  </p>
                </div>
                {getStatusBadge(demo.status)}
              </div>

              {/* Demo Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Demo Date & Time */}
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Demo Date & Time</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatDate(demo.date || demo.demoDate)}
                    </p>
                    <p className="text-sm font-semibold text-teal-600">
                      {formatTime(demo.from || demo.startTime)} - {formatTime(demo.to || demo.endTime)}
                    </p>
                  </div>
                </div>

                {/* Location (Area & City only) */}
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Location</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {demo.area || 'Area not specified'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {demo.city || 'City'}, {demo.state || 'State'}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Session Fee</p>
                    <p className="text-lg font-bold text-green-600">
                      {demo.price !== undefined && demo.price !== null 
                        ? (demo.price === 0 ? 'Free' : `₹${demo.price}`)
                        : 'Free'}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Contact</p>
                    <p className="text-sm font-semibold text-gray-900">{demo.parentPhone || demo.contact || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Privacy Note */}
              <div className="mb-4">
                <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Privacy:</span> House number is hidden for security. Full address will be shared upon acceptance.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {(demo.status === 'PENDING' || demo.status === 'REQUESTED') && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleStatusUpdate(demoId, 'ACCEPT')}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(demoId, 'REJECT')}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Reject
                  </button>
                </div>
              )}

              {demo.status === 'ACCEPTED' && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleStatusUpdate(demoId, 'COMPLETE')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Mark as Complete
                  </button>
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TutorDemoDashboard;
