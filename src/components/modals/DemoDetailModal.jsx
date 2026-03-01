import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getUserFriendlyMessage, getMessageStyle, getMessageIcon } from '../../utils/messageUtils';

const DemoDetailModal = ({ isOpen, onClose, demo, userRole }) => {
  const [tutorDetails, setTutorDetails] = useState(null);
  const [loadingTutor, setLoadingTutor] = useState(false);

  useEffect(() => {
    const fetchTutorDetails = async () => {
      // Only fetch full tutor details if tutorName is not already provided in demo object
      if (userRole === 'PARENT' && demo?.tutorId && isOpen && !demo?.tutorName) {
        try {
          setLoadingTutor(true);
          // Try individual tutor endpoint first
          try {
            const response = await api.get(`/api/tutors/${demo.tutorId}`);
            if (response.data) {
              setTutorDetails(response.data);
              return;
            }
          } catch (error) {
            // If individual endpoint fails (403/401), try getting all tutors
                      }
          
          // Fallback: Get all tutors and find the one we need
          const allTutorsResponse = await api.get('/tutors');
          if (allTutorsResponse.data && Array.isArray(allTutorsResponse.data)) {
            const tutor = allTutorsResponse.data.find(t => t.tutorId === demo.tutorId);
            if (tutor) {
              setTutorDetails(tutor);
            }
          }
        } catch (error) {
                    // Silent fail - will show fallback UI with tutorName from demo object
        } finally {
          setLoadingTutor(false);
        }
      }
    };

    fetchTutorDetails();
  }, [demo?.tutorId, demo?.tutorName, userRole, isOpen]);

  if (!isOpen || !demo) return null;

  const getStatusColor = (status) => {
    const colors = {
      REQUESTED: 'bg-blue-100 text-blue-800 border-blue-200',
      ACCEPTED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      COMPLETED: 'bg-gray-100 text-gray-800 border-gray-200',
      CANCELLED: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
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

  // Generate demo title
  const getDemoTitle = () => {
    if (userRole === 'PARENT') {
      // Use tutorName from demo object first (provided by backend), fallback to fetched tutorDetails
      const tutorName = demo?.tutorName || tutorDetails?.name;
      if (tutorName) {
        return `Demo Class with ${tutorName}`;
      }
    }
    if (userRole === 'TUTOR') {
      return `Demo Session Request`;
    }
    return `Demo Session`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Demo Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{getDemoTitle()}</h3>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(demo.status)}`}>
              {demo.status}
            </span>
          </div>

          {/* Date & Time */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-teal-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-700">Date</p>
                <p className="text-gray-900 font-semibold">{formatDate(demo.date)}</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-5 h-5 text-teal-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-700">Time</p>
                <p className="text-gray-900 font-semibold">
                  {formatTime(demo.from)} - {formatTime(demo.to)}
                </p>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Participants</h4>
            
            {userRole === 'PARENT' ? (
              <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                {loadingTutor ? (
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-teal-200 rounded-full animate-pulse"></div>
                    <div className="ml-3 space-y-2">
                      <div className="h-4 bg-teal-200 rounded w-24 animate-pulse"></div>
                      <div className="h-3 bg-teal-200 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                ) : tutorDetails ? (
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {tutorDetails.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900 text-lg">{tutorDetails.name}</p>
                      <div className="mt-1 space-y-1">
                        {tutorDetails.experience && (
                          <div className="flex items-center text-sm text-teal-700">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {tutorDetails.experience} {tutorDetails.experience === 1 ? 'year' : 'years'} of experience
                          </div>
                        )}
                        {tutorDetails.qualification && (
                          <div className="flex items-center text-sm text-teal-700">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                            {tutorDetails.qualification}
                          </div>
                        )}
                        {tutorDetails.subjects && tutorDetails.subjects.length > 0 && (
                          <div className="flex items-start text-sm text-teal-700">
                            <svg className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="flex-1">Teaches: {tutorDetails.subjects.slice(0, 3).join(', ')}{tutorDetails.subjects.length > 3 ? '...' : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                      T
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Your Tutor</p>
                      <p className="text-sm text-gray-600">Details will be available soon</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    P
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Parent</p>
                    <p className="text-sm text-gray-600">ID: {demo.parentId}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Message - For all statuses with rejection reason field */}
          {demo.rejectionReason && (() => {
            const userMessage = getUserFriendlyMessage(demo.rejectionReason);
            const messageStyle = getMessageStyle(userMessage, demo.status);
            
            return userMessage ? (
              <div className={`rounded-lg p-4 ${messageStyle.container}`}>
                <div className="flex items-start">
                  {getMessageIcon(demo.status) === 'success' && (
                    <svg className={`w-5 h-5 ${messageStyle.icon} mr-2 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {getMessageIcon(demo.status) === 'error' && (
                    <svg className={`w-5 h-5 ${messageStyle.icon} mr-2 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {getMessageIcon(demo.status) === 'info' && (
                    <svg className={`w-5 h-5 ${messageStyle.icon} mr-2 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <div>
                    <p className={`font-medium ${messageStyle.title}`}>
                      {demo.status === 'COMPLETED' ? 'Completed' : demo.status === 'ACCEPTED' ? 'Confirmed' : 'Update'}
                    </p>
                    <p className={`text-sm ${messageStyle.text} mt-1`}>{userMessage}</p>
                  </div>
                </div>
              </div>
            ) : null;
          })()}

          {/* Status Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Status Information</h4>
            <div className="space-y-2 text-sm">
              {demo.status === 'REQUESTED' && (
                <p className="text-gray-600">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  This demo request is pending tutor confirmation
                </p>
              )}
              {demo.status === 'ACCEPTED' && (
                <p className="text-gray-600">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  This demo has been confirmed by the tutor
                </p>
              )}
              {demo.status === 'REJECTED' && (
                <p className="text-gray-600">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  This demo request was declined by the tutor
                </p>
              )}
              {demo.status === 'COMPLETED' && (
                <p className="text-gray-600">
                  <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                  This demo session has been completed
                </p>
              )}
              {demo.status === 'CANCELLED' && (
                <p className="text-gray-600">
                  <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  This demo session was cancelled
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoDetailModal;
