import api from './api';

/**
 * Profile Service
 * Manage user and tutor profiles
 */

export const profileService = {
  /**
   * Get current user's profile
   * @returns {Promise}
   */
  getMyProfile: async () => {
    const response = await api.get('/api/tutors/me');
    // Return full response (includes data, success, message after interceptor)
    return response;
  },

  /**
   * Update tutor profile
   * @param {number} tutorId - Tutor ID
   * @param {Object} profileData - Updated profile data
   * @returns {Promise}
   */
  updateProfile: async (tutorId, profileData) => {
    const response = await api.put(`/api/tutors/${tutorId}`, profileData);
    // Return full response (includes data, success, message after interceptor)
    return response;
  },

  /**
   * Get tutor by ID
   * @param {number} tutorId - Tutor ID
   * @returns {Promise}
   */
  getTutorProfile: async (tutorId) => {
    const response = await api.get(`/api/tutors/${tutorId}`);
    return response;
  },

  /**
   * Add subjects to tutor profile
   * @param {number} tutorId - Tutor ID
   * @param {Array<string>} subjects - Array of subject enum values (e.g., ["MATHEMATICS", "PHYSICS"])
   * @returns {Promise}
   */
  addSubjects: async (tutorId, subjects) => {
    const response = await api.post(`/api/tutors/${tutorId}/subjects`, { subjects });
    return response;
  },

  /**
   * Add classes to tutor profile
   * @param {number} tutorId - Tutor ID
   * @param {Array<string>} classes - Array of class enum values (e.g., ["CLASS_10", "CLASS_11"])
   * @returns {Promise}
   */
  addClasses: async (tutorId, classes) => {
    const response = await api.post(`/api/tutors/${tutorId}/classes`, { classes });
    return response;
  },

  /**
   * Upload profile image
   * @param {File} file - Image file
   * @returns {Promise}
   */
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/tutors/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
};

export default profileService;
