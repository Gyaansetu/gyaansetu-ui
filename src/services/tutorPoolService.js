import api from './api';

/**
 * Tutor Pool Service
 * Admin creates events, Tutors book them
 */

export const tutorPoolService = {
  // ============ ADMIN OPERATIONS ============

  /**
   * Create tutor pool event (Admin only)
   * @param {Object} eventData - Event details
   * @returns {Promise}
   */
  createEvent: async (eventData) => {
    const response = await api.post('/api/tutor-pool/events', eventData);
    return response.data;
  },

  /**
   * Get all tutor pool events (Admin only)
   * @returns {Promise}
   */
  getAllEvents: async () => {
    const response = await api.get('/api/tutor-pool/events/all');
    return response.data;
  },

  /**
   * Mark event as completed (Admin only)
   * @param {number} eventId - Event ID
   * @returns {Promise}
   */
  markEventAsCompleted: async (eventId) => {
    const response = await api.put(`/api/tutor-pool/events/${eventId}/complete`);
    return response.data;
  },

  // ============ TUTOR OPERATIONS ============

  /**
   * Get available events for booking (Tutor only)
   * @returns {Promise}
   */
  getAvailableEvents: async () => {
    const response = await api.get('/api/tutor-pool/events/available');
    return response; // Return full response object with success, data, message
  },

  /**
   * Book an event (Tutor only)
   * @param {number} eventId - Event ID to book
   * @returns {Promise}
   */
  bookEvent: async (eventId) => {
    const response = await api.post('/api/tutor-pool/bookings', { eventId });
    return response; // Return full response object with success, data, message
  },

  /**
   * Cancel booking (Tutor only)
   * @param {number} eventId - Event ID to cancel
   * @returns {Promise}
   */
  cancelBooking: async (eventId) => {
    const response = await api.delete(`/api/tutor-pool/bookings/events/${eventId}`);
    return response; // Return full response object with success, data, message
  },

  /**
   * Get my booked events (Tutor only)
   * @returns {Promise}
   */
  getMyBookedEvents: async () => {
    const response = await api.get('/api/tutor-pool/bookings/my-bookings');
    return response.data;
  },

  // ============ COMMON OPERATIONS ============

  /**
   * Get event details with bookings
   * @param {number} eventId - Event ID
   * @returns {Promise}
   */
  getEventDetails: async (eventId) => {
    const response = await api.get(`/api/tutor-pool/events/${eventId}`);
    return response.data;
  },
};

export default tutorPoolService;
