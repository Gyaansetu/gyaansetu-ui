import { useState } from 'react';
import TutorDemoDashboard from '../dashboard/TutorDemoDashboard';

const TutorProfileSection = ({ tutorData, onEditProfile }) => {
  const { user, tutorProfile } = tutorData;
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'demos'

  // Add safety check
  if (!user) {
        return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Unable to load user data. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  // Handle case where tutor profile doesn't exist yet
  if (!tutorProfile) {
        return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Welcome, {user.name}! 👋
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              Your tutor profile is not set up yet.
            </p>
            <p className="text-gray-600 mb-6">
              Complete your profile to start receiving demo requests from parents and showcase your teaching expertise.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">To complete your profile, you'll need to add:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-teal-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Basic information (gender, experience, qualification)</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-teal-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Location details</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-teal-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Subjects you teach</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-teal-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Classes/grades you teach</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => window.location.href = '/tutor/setup'}
            className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Complete Your Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-20 md:pt-24 pb-8 space-y-4 md:space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex gap-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="hidden sm:inline">My Profile</span>
          <span className="sm:hidden">Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('demos')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'demos'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="hidden sm:inline">Demo Bookings</span>
          <span className="sm:hidden">Demos</span>
        </button>
      </div>

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'demos' ? (
        <TutorDemoDashboard />
      ) : (
        <>
          {/* Profile Header Card with Avatar */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl shadow-lg p-6 md:p-8 border border-teal-100">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Avatar */}
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl">
              {user?.name?.charAt(0).toUpperCase() || 'T'}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{user?.name || 'Tutor'}</h1>
                <p className="text-teal-600 font-medium text-sm md:text-base">Professional Tutor</p>
              </div>
              <button
                onClick={onEditProfile}
                className="px-4 py-2 bg-white text-teal-600 border-2 border-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all duration-200 text-sm font-semibold flex items-center gap-2 mx-auto md:mx-0 shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            </div>
            
            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 bg-white rounded-lg p-3 shadow-sm">
                <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.email || tutorProfile?.email || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-white rounded-lg p-3 shadow-sm">
                <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{user?.phone || tutorProfile?.phone || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-white rounded-lg p-3 shadow-sm">
                <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Experience</p>
                  <p className="text-sm font-medium text-gray-900">{tutorProfile?.experience || 0} Years</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-white rounded-lg p-3 shadow-sm">
                <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Rating</p>
                  <p className="text-sm font-medium text-gray-900">{tutorProfile?.ratingAvg || 0} / 5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Status Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border-2 border-green-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start md:items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Profile Status: {user?.profileStatus || 'Active'}</h3>
              <p className="text-xs md:text-sm text-gray-600">Your profile is complete and visible to students</p>
            </div>
          </div>
          <div className="text-left md:text-right ml-auto md:ml-0">
            <p className="text-xs text-gray-500 mb-1">Last Updated</p>
            <p className="text-sm font-semibold text-gray-900">11 Feb 2026</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-gray-500">Gender</p>
            <p className="text-base md:text-lg font-semibold text-gray-900">{tutorProfile.gender || 'Not specified'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-gray-500">Location</p>
            <p className="text-base md:text-lg font-semibold text-gray-900">
              {tutorProfile?.location?.city || 'City'}, {tutorProfile?.location?.state || 'State'}
            </p>
          </div>
        </div>
      </div>

      {/* Qualification */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
          Qualification
        </h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">{tutorProfile.qualification || 'Not specified'}</p>
      </div>

      {/* Profile Summary */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          About Me
        </h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">{tutorProfile.profileSummary || 'No profile summary available yet. Complete your profile to add more information about yourself.'}</p>
      </div>

      {/* Location */}
      {tutorProfile?.location && (
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Location
          </h2>
          <div className="space-y-2">
            {tutorProfile.location?.houseNo && (
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <p className="text-sm md:text-base text-gray-700">{tutorProfile.location?.houseNo}</p>
              </div>
            )}
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-sm md:text-base text-gray-700">{tutorProfile.location?.area || 'Area not specified'}</p>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm md:text-base text-gray-700">
                {tutorProfile.location?.city || 'City'}, {tutorProfile.location?.state || 'State'}
                {tutorProfile.location?.pincode && <span className="ml-1">- {tutorProfile.location.pincode}</span>}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subjects & Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Subjects */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Subjects I Teach
          </h2>
          <div className="flex flex-wrap gap-2">
            {tutorProfile?.subjects && tutorProfile.subjects.length > 0 ? (
              tutorProfile.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-teal-100 text-teal-700 rounded-full font-medium text-xs md:text-sm"
                >
                  {subject}
                </span>
              ))
            ) : (
              <p className="text-xs md:text-sm text-gray-500 italic">No subjects added yet. Add subjects to complete your profile.</p>
            )}
          </div>
        </div>

        {/* Classes */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Classes I Teach
          </h2>
          <div className="flex flex-wrap gap-2">
            {tutorProfile?.classLevels && tutorProfile.classLevels.length > 0 ? (
              tutorProfile.classLevels.map((classLevel, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-100 text-blue-700 rounded-full font-medium text-xs md:text-sm"
                >
                  {classLevel}
                </span>
              ))
            ) : (
              <p className="text-xs md:text-sm text-gray-500 italic">No classes added yet. Add classes to complete your profile.</p>
            )}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default TutorProfileSection;
