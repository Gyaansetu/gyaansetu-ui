import api from './api';

/**
 * Demo Request Service
 * Parent creates demo requests, Tutor accepts/rejects
 */

export const demoService = {
  /**
   * Create a demo request (Parent only)
   * @param {Object} demoData - Demo request details
   * @returns {Promise}
   */
  createDemo: async (demoData) => {
    const response = await api.post('/api/demos', demoData);
    return response.data;
  },

  /**
   * Get my demo requests (Parent sees their requests, Tutor sees requests sent to them)
   * @returns {Promise}
   */
  getMyDemos: async () => {
    const response = await api.get('/api/demos/my');
    return response.data;
  },

  /**
   * Tutor accepts or rejects a demo request
   * @param {number} demoId - Demo request ID
   * @param {Object} actionData - { action: 'ACCEPT' | 'REJECT', rejectionReason?: string }
   * @returns {Promise}
   */
  actOnDemo: async (demoId, actionData) => {
    const response = await api.post(`/api/demos/${demoId}/action`, actionData);
    return response.data;
  },

  /**
   * Update demo status (Tutor only)
   * @param {number} demoId - Demo request ID
   * @param {string} status - New status (ACCEPTED, REJECTED, COMPLETED)
   * @returns {Promise}
   */
  updateDemoStatus: async (demoId, status) => {
    const response = await api.patch(`/api/demos/${demoId}/status`, { status });
    return response.data;
  },
};

export default demoService;
