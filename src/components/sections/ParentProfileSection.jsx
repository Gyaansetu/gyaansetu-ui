import { useState } from 'react';
import DemoDetailModal from '../modals/DemoDetailModal';
import { getUserFriendlyMessage, getMessageStyle } from '../../utils/messageUtils';

const ParentProfileSection = ({ profileData, activeTab, setActiveTab, onRefresh, onEditProfile }) => {
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const { user, profileDetails, demos } = profileData;

  const handleDemoClick = (demo) => {
    setSelectedDemo(demo);
    setDetailModalOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      REQUESTED: 'bg-blue-100 text-blue-800',
      ACCEPTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 pt-20 md:pt-24">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 md:mb-8">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 h-24 md:h-32"></div>
        <div className="px-4 md:px-8 pb-6 md:pb-8">
          <div className="flex flex-col sm:flex-row items-start -mt-12 md:-mt-16 gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=14b8a6&color=fff&size=128`}
                alt={user.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-0 right-0 bg-teal-500 text-white text-xs px-2 py-1 rounded-full border-2 border-white">
                Parent
              </div>
            </div>
            <div className="flex-1 mt-12 md:mt-20">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">Parent Account</p>
            </div>
            <div className="w-full sm:w-auto mt-2 sm:mt-20">
              <button
                onClick={onEditProfile}
                className="w-full sm:w-auto px-4 md:px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Email</p>
                <p className="text-sm md:text-base text-gray-900 break-all">{user.email || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Phone</p>
                <p className="text-sm md:text-base text-gray-900">{user.phone}</p>
              </div>
            </div>
          </div>

          {/* Location Details - NEW */}
          {profileDetails && (profileDetails.city || profileDetails.area || profileDetails.state || profileDetails.pincode) && (
            <div className="mt-4 p-4 bg-teal-50 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-teal-900">Location</p>
                  <p className="text-sm text-teal-700 mt-1">
                    {profileDetails.houseNo && `${profileDetails.houseNo}, `}
                    {profileDetails.area && `${profileDetails.area}, `}
                    {profileDetails.city && `${profileDetails.city}`}
                    {profileDetails.state && `, ${profileDetails.state}`}
                    {profileDetails.pincode && ` - ${profileDetails.pincode}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-4 md:mb-6 overflow-x-auto">
        <div className="border-b border-gray-200">
          <div className="flex min-w-max md:min-w-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab('demos')}
              className={`px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'demos'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Demo Requests
              {demos && demos.length > 0 && (
                <span className="ml-2 bg-teal-100 text-teal-600 px-2 py-1 rounded-full text-xs">
                  {demos.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Profile Information</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <p className="text-sm md:text-base text-gray-900 bg-gray-50 px-3 md:px-4 py-2 rounded-lg break-words">{user.name}</p>
            </div>
            
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <p className="text-sm md:text-base text-gray-900 bg-gray-50 px-3 md:px-4 py-2 rounded-lg">{user.phone}</p>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <p className="text-sm md:text-base text-gray-900 bg-gray-50 px-3 md:px-4 py-2 rounded-lg break-all">{user.email || 'Not provided'}</p>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <p className="text-sm md:text-base text-gray-900 bg-gray-50 px-3 md:px-4 py-2 rounded-lg">Parent Account</p>
            </div>

            {/* Location Information */}
            {profileDetails && (profileDetails.city || profileDetails.area || profileDetails.state || profileDetails.pincode) && (
              <>
                {profileDetails.houseNo && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">House No / Flat</label>
                    <p className="text-sm md:text-base text-gray-900 bg-gray-50 px-3 md:px-4 py-2 rounded-lg">{profileDetails.houseNo}</p>
                  </div>
                )}
                {profileDetails.area && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Area / Locality</label>
                    <p className="text-sm md:text-base text-gray-900 bg-gray-50 px-3 md:px-4 py-2 rounded-lg">{profileDetails.area}</p>
                  </div>
                )}
                {profileDetails.city && (
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">City</label>
                    <p className="text-sm md:text-base text-gray-900 bg-gray-50 px-3 md:px-4 py-2 rounded-lg">{profileDetails.city}</p>
                  </div>
                )}
                {profileDetails.state && (
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">State</label>
                    <p className="text-sm md:text-base text-gray-900 bg-gray-50 px-3 md:px-4 py-2 rounded-lg">{profileDetails.state}</p>
                  </div>
                )}
                {profileDetails.pincode && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <p className="text-sm md:text-base text-gray-900 bg-gray-50 px-3 md:px-4 py-2 rounded-lg">{profileDetails.pincode}</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-6 md:mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-teal-50 rounded-lg p-3 md:p-4">
                <p className="text-xs md:text-sm text-teal-600 font-medium">Total Demos</p>
                <p className="text-2xl md:text-3xl font-bold text-teal-700 mt-1">{demos?.length || 0}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 md:p-4">
                <p className="text-xs md:text-sm text-green-600 font-medium">Accepted</p>
                <p className="text-2xl md:text-3xl font-bold text-green-700 mt-1">
                  {demos?.filter(d => d.status === 'ACCEPTED').length || 0}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 md:p-4">
                <p className="text-xs md:text-sm text-blue-600 font-medium">Pending</p>
                <p className="text-2xl md:text-3xl font-bold text-blue-700 mt-1">
                  {demos?.filter(d => d.status === 'REQUESTED').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'demos' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Demo Requests</h2>
            <button
              onClick={onRefresh}
              className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
            >
              Refresh
            </button>
          </div>

          {!demos || demos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
              <svg className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-base md:text-lg font-medium text-gray-900">No demo requests yet</h3>
              <p className="mt-2 text-sm md:text-base text-gray-600">Your demo requests will appear here once you book a session with a tutor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {demos.map((demo) => (
                <div
                  key={demo.demoId}
                  onClick={() => handleDemoClick(demo)}
                  className="bg-white rounded-lg shadow-md p-4 md:p-6 cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">Demo #{demo.demoId}</h3>
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(demo.status)}`}>
                      {demo.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-xs md:text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(demo.date)}
                    </div>
                    
                    <div className="flex items-center text-xs md:text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(demo.from)} - {formatTime(demo.to)}
                    </div>

                    {demo.rejectionReason && (() => {
                      const userMessage = getUserFriendlyMessage(demo.rejectionReason);
                      const messageStyle = getMessageStyle(userMessage, demo.status);
                      
                      return userMessage ? (
                        <div className={`mt-3 p-3 rounded-lg ${messageStyle.container}`}>
                          <p className={`text-xs ${messageStyle.text}`}>{userMessage}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>

                  <button className="mt-4 w-full px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition text-xs md:text-sm font-medium">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Demo Detail Modal */}
      {selectedDemo && (
        <DemoDetailModal
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedDemo(null);
          }}
          demo={selectedDemo}
          userRole="PARENT"
        />
      )}
    </div>
  );
};

export default ParentProfileSection;
