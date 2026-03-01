import api from './api';

/**
 * Tutor Search Service
 * Find tutors by location, subject, and class
 */

export const tutorService = {
  /**
   * Get all tutors (no filters)
   * @returns {Promise}
   */
  getAllTutors: async () => {
    const response = await api.get('/tutors');
    return response.data;
  },

  /**
   * Search tutors by location and criteria
   * @param {Object} params - Search parameters
   * @param {string} params.city - City name
   * @param {string} params.state - State name
   * @param {number} params.subjectId - Subject ID
   * @param {number} params.classLevelId - Class level ID
   * @returns {Promise}
   */
  searchTutors: async ({ city, state, subjectId, classLevelId }) => {
    const response = await api.get('/tutors/search', {
      params: { city, state, subjectId, classLevelId },
    });
    return response.data;
  },
};

export default tutorService;
