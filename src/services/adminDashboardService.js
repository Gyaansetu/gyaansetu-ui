import api from './api';

/**
 * Admin Dashboard Service
 * Handles all admin dashboard-related API calls
 */

const adminDashboardService = {
  /**
   * Get dashboard statistics
   * @returns {Promise} Dashboard statistics
   */
  getStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      // Return response object with success, data, message for admin dashboard
      return { success: response.success, data: response.data, message: response.message };
    } catch (error) {
            throw error;
    }
  },

  /**
   * Get all tutor pool events
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
   * @param {string} params.sortBy - Sort field (demoDate, createdAt)
   * @param {string} params.sortDirection - Sort direction (asc, desc)
   * @returns {Promise} Array of tutor pool events
   */
  getTutorPoolEvents: async (params = {}) => {
    try {
      const response = await api.get('/admin/dashboard/tutor-pool-events', { params });
      // Return response object with success, data, message for admin dashboard
      return { success: response.success, data: response.data, message: response.message };
    } catch (error) {
            throw error;
    }
  },

  /**
   * Get a single tutor pool event by ID
   * @param {number} id - Event ID
   * @returns {Promise} Tutor pool event with booking details
   */
  getTutorPoolEvent: async (id) => {
    try {
      const response = await api.get(`/admin/dashboard/tutor-pool-events/${id}`);
      // Return response object with success, data, message for admin dashboard
      return { success: response.success, data: response.data, message: response.message };
    } catch (error) {
            throw error;
    }
  },

  /**
   * Update tutor pool event status
   * @param {number} id - Event ID
   * @param {Object} data - Update data
   * @param {string} data.status - New status
   * @param {string} data.notes - Optional notes
   * @returns {Promise} Updated event
   */
  updateTutorPoolEventStatus: async (id, data) => {
    try {
      const response = await api.patch(`/admin/dashboard/tutor-pool-events/${id}/status`, data);
      // Return response object with success, data, message for admin dashboard
      return { success: response.success, data: response.data, message: response.message };
    } catch (error) {
            throw error;
    }
  },

  /**
   * Get all direct bookings (demo requests)
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (PENDING, ACCEPTED, REJECTED, COMPLETED)
   * @param {string} params.sortBy - Sort field (demoDate, createdAt)
   * @param {string} params.sortDirection - Sort direction (asc, desc)
   * @returns {Promise} Array of direct bookings
   */
  getDirectBookings: async (params = {}) => {
    try {
      const response = await api.get('/admin/dashboard/direct-bookings', { params });
      // Return response object with success, data, message for admin dashboard
      return { success: response.success, data: response.data, message: response.message };
    } catch (error) {
            throw error;
    }
  },

  /**
   * Get a single direct booking by ID
   * @param {number} id - Booking ID
   * @returns {Promise} Direct booking details
   */
  getDirectBooking: async (id) => {
    try {
      const response = await api.get(`/admin/dashboard/direct-bookings/${id}`);
      // Return response object with success, data, message for admin dashboard
      return { success: response.success, data: response.data, message: response.message };
    } catch (error) {
            throw error;
    }
  },

  /**
   * Update direct booking status
   * @param {number} id - Booking ID
   * @param {Object} data - Update data
   * @param {string} data.status - New status
   * @param {string} data.notes - Optional notes
   * @returns {Promise} Updated booking
   */
  updateDirectBookingStatus: async (id, data) => {
    try {
      const response = await api.patch(`/admin/dashboard/direct-bookings/${id}/status`, data);
      // Return response object with success, data, message for admin dashboard
      return { success: response.success, data: response.data, message: response.message };
    } catch (error) {
            throw error;
    }
  },

  /**
   * Mark payment as received (unified method for both types)
   * @param {number} bookingId - Booking/Event ID
   * @param {string} bookingType - Type: 'tutor-pool' or 'direct'
   * @returns {Promise} Success message
   */
  markPaymentReceived: async (bookingId, bookingType) => {
    try {
      const response = await api.post(`/admin/dashboard/bookings/${bookingId}/payment-received?bookingType=${bookingType}`);
      // Return response object with success, data, message for admin dashboard
      return { success: response.success, data: response.data, message: response.message };
    } catch (error) {
            throw error;
    }
  },

  /**
   * Mark payment as received for tutor pool event
   * @param {number} id - Event ID
   * @returns {Promise} Updated event
   */
  markTutorPoolPaymentReceived: async (id) => {
    try {
      const response = await api.put(`/admin/dashboard/tutor-pool-events/${id}/payment-received`);
      // Return response object with success, data, message for admin dashboard
      return { success: response.success, data: response.data, message: response.message };
    } catch (error) {
            throw error;
    }
  },

  /**
   * Mark payment as received for direct booking
   * @param {number} id - Booking ID
   * @returns {Promise} Updated booking
   */
  markDirectBookingPaymentReceived: async (id) => {
    try {
      const response = await api.put(`/admin/dashboard/direct-bookings/${id}/payment-received`);
      // Return response object with success, data, message for admin dashboard
      return { success: response.success, data: response.data, message: response.message };
    } catch (error) {
            throw error;
    }
  },

  /**
   * Approve a direct booking (demo request)
   * @param {number} id - Booking ID
   * @returns {Promise} Updated booking
   */
  approveDirectBooking: async (id) => {
    try {
      const response = await api.post(`/admin/dashboard/direct-bookings/${id}/approve`);
      return { success: response.success, data: response.data, message: response.message };
    } catch (error) {
            throw error;
    }
  },

  /**
   * Reject a direct booking (demo request)
   * @param {number} id - Booking ID
   * @param {string} reason - Rejection reason
   * @returns {Promise} Updated booking
   */
  rejectDirectBooking: async (id, reason) => {
    try {
      const response = await api.post(`/admin/dashboard/direct-bookings/${id}/reject?reason=${encodeURIComponent(reason)}`);
      return { success: response.success, data: response.data, message: response.message };
    } catch (error) {
            throw error;
    }
  },
};

export default adminDashboardService;
