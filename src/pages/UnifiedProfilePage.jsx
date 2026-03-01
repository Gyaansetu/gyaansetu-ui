import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import unifiedProfileService from '../services/unifiedProfileService';

// Role-specific profile components
import ParentProfileSection from '../components/sections/ParentProfileSection';
import TutorProfileSection from '../components/sections/TutorProfileSection';
import AdminProfileSection from '../components/sections/AdminProfileSection';
import EditProfileModal from '../components/modals/EditProfileModal';
import EditParentProfileModal from '../components/modals/EditParentProfileModal';

const UnifiedProfilePage = ({ 
  onOpenLogin, 
  onOpenRegister, 
  onNavigateToFindTutor,
  onNavigateToProfile,
  onNavigateToAdminBooking,
  onNavigateToAdminDashboard,
  onNavigateToTutorPool,
  onNavigateHome 
}) => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'demos', 'settings'
  
  const { toast, showSuccess, showError, hideToast } = useToast();
  const { user, isAuthenticated, hasRole } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      showError('Please login to view profile');
      onOpenLogin();
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await unifiedProfileService.getUnifiedProfile();
      setProfileData(data);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      showError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      // Handle save based on role
      if (profileData.role === 'TUTOR') {
        // Backend now accepts subjects and classes in the main update call
        // No need to make separate API calls
        await unifiedProfileService.updateTutorProfile(
          profileData.profileDetails.tutorId,
          updatedData // includes subjects and classes
        );
      } else if (profileData.role === 'PARENT') {
        await unifiedProfileService.updateParentProfile(
          profileData.profileDetails.parentId,
          updatedData
        );
      }
      
      showSuccess('Profile updated successfully!');
      setEditModalOpen(false);
      fetchProfile(); // Refresh data to show new subjects/classes
    } catch (err) {
            showError('Failed to update profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <Navbar
          onOpenLogin={onOpenLogin}
          onOpenRegister={onOpenRegister}
          onNavigateToFindTutor={onNavigateToFindTutor}
          onNavigateToProfile={onNavigateToProfile}
          onNavigateToAdminBooking={onNavigateToAdminBooking}
          onNavigateToAdminDashboard={onNavigateToAdminDashboard}
          onNavigateToTutorPool={onNavigateToTutorPool}
          onNavigateHome={onNavigateHome}
        />
        
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <Navbar
          onOpenLogin={onOpenLogin}
          onOpenRegister={onOpenRegister}
          onNavigateToFindTutor={onNavigateToFindTutor}
          onNavigateToProfile={onNavigateToProfile}
          onNavigateToAdminBooking={onNavigateToAdminBooking}
          onNavigateToAdminDashboard={onNavigateToAdminDashboard}
          onNavigateToTutorPool={onNavigateToTutorPool}
          onNavigateHome={onNavigateHome}
        />
        
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Error Loading Profile</h3>
              <p className="mt-2 text-gray-600">{error || 'Something went wrong'}</p>
              <button
                onClick={fetchProfile}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>

        <Footer />
        <Toast toast={toast} onClose={hideToast} />
      </div>
    );
  }

  // Render role-specific profile
  const renderProfileContent = () => {
    switch (profileData.role) {
      case 'PARENT':
        return (
          <ParentProfileSection
            profileData={profileData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onRefresh={fetchProfile}
            onEditProfile={() => setEditModalOpen(true)}
          />
        );

      case 'TUTOR':
        return (
          <TutorProfileSection
            tutorData={{
              user: profileData.user,
              tutorProfile: profileData.profileDetails
            }}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onEditProfile={() => setEditModalOpen(true)}
            onRefresh={fetchProfile}
          />
        );

      case 'ADMIN':
        return (
          <AdminProfileSection
            profileData={profileData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onNavigateToAdminDashboard={onNavigateToAdminDashboard}
            onNavigateToAdminBooking={onNavigateToAdminBooking}
            onNavigateToTutorPool={onNavigateToTutorPool}
          />
        );

      default:
        return (
          <div className="text-center py-20">
            <p className="text-gray-600">Unknown user role</p>
          </div>
        );
    }
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
        onNavigateToTutorPool={onNavigateToTutorPool}
        onNavigateHome={onNavigateHome}
      />

      {renderProfileContent()}

      <Footer />

      {/* Edit Profile Modal - For TUTOR */}
      {profileData.role === 'TUTOR' && (
        <EditProfileModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          tutorData={{
            user: profileData.user,
            tutorProfile: profileData.profileDetails
          }}
          onSave={handleSaveProfile}
        />
      )}

      {/* Edit Profile Modal - For PARENT */}
      {profileData.role === 'PARENT' && (
        <EditParentProfileModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          parentData={{
            ...profileData.user,
            ...profileData.profileDetails
          }}
          onSave={handleSaveProfile}
        />
      )}

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
};

export default UnifiedProfilePage;
