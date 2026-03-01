import api from './api';

/**
 * Unified Profile Service
 * Handles profile operations for all user roles (PARENT, TUTOR, ADMIN)
 */

const profileService = {
  /**
   * Get unified profile based on user role
   * Automatically detects role and fetches appropriate profile data
   * @returns {Promise} Profile data with role-specific information
   */
  getUnifiedProfile: async () => {
    try {
      // First, get user info to determine role
      const userResponse = await api.get('/api/auth/me');
            
      const user = userResponse.data;
      const role = user.role;
            
      let profileData = {
        user,
        role,
        profileDetails: null,
        demos: []
      };

      // Fetch role-specific data
            switch (role) {
        case 'PARENT':
                    // Get parent profile
          const parentProfileResponse = await api.get('/api/parents/my-profile');
                    profileData.profileDetails = parentProfileResponse.data.data;
          
          // Get parent's demo requests
                    const parentDemosResponse = await api.get('/api/demos/my');
                    profileData.demos = parentDemosResponse.data;
          break;

        case 'TUTOR':
                    // Get tutor profile
          try {
            const tutorProfileResponse = await api.get('/api/tutors/me');
                                                profileData.profileDetails = tutorProfileResponse.data.data || tutorProfileResponse.data;
          } catch (error) {
                                                                        
            // If profile doesn't exist (404), set null so UI can show "Complete Profile" message
            if (error.response?.status === 404) {
                            profileData.profileDetails = null;
            } else {
              // For other errors, re-throw
              throw error;
            }
          }
          
          // Get tutor's demo requests
                    const tutorDemosResponse = await api.get('/api/demos/my');
                    profileData.demos = tutorDemosResponse.data;
          break;

        case 'ADMIN':
                    // Get admin-specific data
          const statsResponse = await api.get('/api/admin/dashboard/stats');
                    profileData.profileDetails = {
            ...user,
            stats: statsResponse.data.data
          };
          break;

        default:
          throw new Error('Unknown user role');
      }

      return profileData;
    } catch (error) {
      console.error('Error fetching unified profile:', error);
      throw error;
    }
  },

  /**
   * Get parent profile
   */
  getParentProfile: async () => {
    const response = await api.get('/api/parents/my-profile');
    return response.data;
  },

  /**
   * Get tutor profile
   */
  getTutorProfile: async () => {
    const response = await api.get('/api/tutors/me');
    return response.data;
  },

  /**
   * Get demo requests for the logged-in user
   */
  getMyDemos: async () => {
    const response = await api.get('/api/demos/my');
    return response.data;
  },

  /**
   * Update tutor profile
   */
  updateTutorProfile: async (tutorId, updateData) => {
    const response = await api.put(`/api/tutors/${tutorId}`, updateData);
    return response.data;
  },

  /**
   * Update parent profile
   */
  updateParentProfile: async (parentId, updateData) => {
    const response = await api.put(`/api/parents/${parentId}`, updateData);
    return response.data;
  },

  /**
   * Add subjects to tutor profile
   */
  addSubjects: async (tutorId, subjects) => {
    const response = await api.post(`/api/tutors/${tutorId}/subjects`, { subjects });
    return response.data;
  },

  /**
   * Add classes to tutor profile
   */
  addClasses: async (tutorId, classes) => {
    const response = await api.post(`/api/tutors/${tutorId}/classes`, { classes });
    return response.data;
  },
};

export default profileService;
