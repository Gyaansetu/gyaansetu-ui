import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TutorProfileSection from '../components/sections/TutorProfileSection';
import BookingsSection from '../components/sections/BookingsSection';
import EditProfileModal from '../components/modals/EditProfileModal';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';

const TutorProfilePage = ({ onOpenLogin, onOpenRegister, onNavigateToFindTutor, onNavigateToProfile, onNavigateToAdminBooking, onNavigateToAdminDashboard, onNavigateToTutorPool, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'bookings'
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop');
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  // API integration state
  const [tutorData, setTutorData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, hasRole } = useAuth();

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please upload an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        showSuccess('Profile picture updated successfully!');
        
        // TODO: Upload to server
              };
      reader.readAsDataURL(file);
    }
  };

  // Fetch profile data from API
  useEffect(() => {
    if (!isAuthenticated()) {
      showError('Please login to view profile');
      return;
    }

    if (!hasRole('TUTOR')) {
      showError('Only tutors can access this page');
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileService.getMyProfile();
            
      // After axios interceptor, response has: { data: {...tutorProfile}, success: true, message: "..." }
      if (response && response.data) {
        // Map backend data to frontend structure
        const mappedData = mapBackendToFrontend(response.data);
        setTutorData(mappedData);
        
        // Set profile image
        if (mappedData.tutorProfile.profileImage) {
          setProfileImage(mappedData.tutorProfile.profileImage);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
            setError(err.message || 'Failed to load profile');
      showError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Map backend response to frontend structure
  const mapBackendToFrontend = (data) => ({
    user: {
      id: data.userId,
      name: data.name,
      email: data.email,
      phone: data.phone || 'N/A',
      role: 'TUTOR',
      status: 'ACTIVE',
      profileStatus: 'COMPLETE',
    },
    tutorProfile: {
      id: data.tutorId,
      gender: data.gender,
      qualification: data.qualification,
      experience: data.experience,
      profileSummary: data.profileSummary || 'No summary available',
      profileImage: data.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=14b8a6&color=fff&size=400`,
      location: {
        id: 1,
        city: data.location?.city || '',
        area: data.location?.area || '',
        state: data.location?.state || '',
        pincode: data.location?.pincode || '',
      },
      ratingAvg: data.ratingAvg || 0,
      tutorSubjects: (data.subjects || []).map((subject, idx) => ({
        id: idx + 1,
        subject: { name: subject, category: 'N/A' }
      })),
      tutorClasses: (data.classLevels || []).map((classLevel, idx) => ({
        id: idx + 1,
        classLevel: { name: classLevel, level: parseInt(classLevel.match(/\d+/)?.[0] || 0) }
      })),
    },
  });

  // Handle profile update
  const handleProfileUpdate = async (updatedData) => {
    if (!tutorData) return;
    
    try {
      // Extract subjects and classes from updated data
      const { selectedSubjects, selectedClasses, ...profileData } = updatedData;
      
      // Update basic profile information
      const response = await profileService.updateProfile(
        tutorData.tutorProfile.id,
        profileData
      );
      
      if (response.success || response.data) {
        // Update subjects if provided
        if (selectedSubjects && selectedSubjects.length > 0) {
          try {
            await profileService.addSubjects(tutorData.tutorProfile.id, selectedSubjects);
                      } catch (subjectError) {
                        // Continue even if subjects fail
          }
        }
        
        // Update classes if provided
        if (selectedClasses && selectedClasses.length > 0) {
          try {
            await profileService.addClasses(tutorData.tutorProfile.id, selectedClasses);
                      } catch (classError) {
                        // Continue even if classes fail
          }
        }
        
        showSuccess('Profile updated successfully!');
        await fetchProfile(); // Refresh data to show new subjects/classes
        setEditModalOpen(false);
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
            showError(error.message || 'Failed to update profile. Please try again.');
    }
  };

  // Mock tutor data - REMOVED, now using API
  // const tutorData = { ... }

  // Mock bookings data - will come from backend API
  const bookingsData = {
    pending: [
      {
        id: 1,
        studentName: 'Rajesh Kumar',
        class: 'Class 10',
        subject: 'Mathematics',
        date: '2026-02-15',
        time: '4:00 PM',
        duration: '1 hour',
        requestedOn: '2026-02-11T10:30:00',
        status: 'PENDING',
      },
      {
        id: 2,
        studentName: 'Anita Desai',
        class: 'Class 12',
        subject: 'Physics',
        date: '2026-02-16',
        time: '6:00 PM',
        duration: '1 hour',
        requestedOn: '2026-02-11T09:15:00',
        status: 'PENDING',
      },
    ],
    accepted: [
      {
        id: 3,
        studentName: 'Priya Sharma',
        class: 'Class 8',
        subject: 'Science',
        date: '2026-02-12',
        time: '5:30 PM',
        duration: '1 hour',
        requestedOn: '2026-02-10T16:45:00',
        acceptedOn: '2026-02-10T17:00:00',
        status: 'ACCEPTED',
        address: 'House No. 123, Sector 18, Noida, UP - 201301',
      },
      {
        id: 4,
        studentName: 'Amit Patel',
        class: 'Class 11',
        subject: 'Chemistry',
        date: '2026-02-13',
        time: '3:00 PM',
        duration: '1 hour',
        requestedOn: '2026-02-09T14:20:00',
        acceptedOn: '2026-02-09T15:00:00',
        status: 'ACCEPTED',
        address: 'Flat 45, Building 7, Green Valley Society, Gurgaon - 122001',
      },
    ],
    rejected: [
      {
        id: 5,
        studentName: 'Neha Singh',
        class: 'Class 9',
        subject: 'Mathematics',
        date: '2026-02-14',
        time: '7:00 PM',
        duration: '1 hour',
        requestedOn: '2026-02-08T11:00:00',
        rejectedOn: '2026-02-08T12:00:00',
        status: 'REJECTED',
        rejectionReason: 'Time slot not available',
      },
    ],
  };

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
        currentPage="profile"
      />
      
      <main className="pt-20">
        {/* Loading State */}
        {isLoading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Profile</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchProfile}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Profile Content */}
        {!isLoading && !error && tutorData && (
          <>
        {/* Header Section with Pattern */}
        <div className="relative overflow-hidden z-20 bg-teal-500">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-30">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative group profile-image-container z-40">
                {/* Image Container with Hover Effect */}
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white relative cursor-pointer transition-all duration-300 group-hover:shadow-2xl">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt={tutorData.user.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                      <span className="text-white text-5xl font-bold">
                        {tutorData.user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Camera Button */}
                <button
                  onClick={() => document.getElementById('profile-image-upload').click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-50 hover:scale-110 transition-all duration-200 border-2 border-teal-500"
                  title="Change profile picture"
                >
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-2">{tutorData.user.name}</h1>
                <p className="text-white/90 text-lg mb-4">
                  {tutorData.tutorProfile.qualification?.split(',')[0] || 'Not specified'} • {tutorData.tutorProfile.location?.city || 'Location not set'}
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                    <span className="text-yellow-300 text-lg">⭐</span>
                    <span className="text-white font-semibold">{tutorData.tutorProfile.ratingAvg || 0}/5.0</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white font-semibold">{tutorData.tutorProfile.experience || 0} Years Experience</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white font-semibold">{tutorData.tutorProfile.tutorSubjects?.length || 0} Subjects</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white font-semibold">{tutorData.tutorProfile.tutorClasses?.length || 0} Classes</span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="md:self-start">
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border-b sticky top-20 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-2 font-semibold border-b-2 transition-colors relative ${
                  activeTab === 'bookings'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Bookings
                {bookingsData.pending.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {bookingsData.pending.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'profile' ? (
            <TutorProfileSection tutorData={tutorData} />
          ) : (
            <BookingsSection bookingsData={bookingsData} />
          )}
        </div>
        </>
        )}
      </main>

      <Footer />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        tutorData={tutorData}
        onSave={handleProfileUpdate}
      />

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

export default TutorProfilePage;
