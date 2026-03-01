const AdminProfileSection = ({ 
  profileData, 
  activeTab, 
  setActiveTab,
  onNavigateToAdminDashboard,
  onNavigateToAdminBooking,
  onNavigateToTutorPool 
}) => {
  const { user, profileDetails } = profileData;
  const stats = profileDetails?.stats || {};

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-32"></div>
        <div className="px-8 pb-8">
          <div className="flex items-start -mt-16">
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c3aed&color=fff&size=128`}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 rounded-full border-2 border-white">
                Admin
              </div>
            </div>
            <div className="ml-6 mt-20">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 mt-1">System Administrator</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{user.email || 'admin@gyaansetu.com'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{user.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">{stats.totalUsers || 0}</p>
              </div>
              <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Parents: {stats.totalParents || 0} • Tutors: {stats.totalTutors || 0}
            </p>
          </div>

          {/* Total Demos */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Demos</p>
                <p className="text-3xl font-bold text-green-700 mt-2">{stats.totalDemos || 0}</p>
              </div>
              <svg className="w-12 h-12 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-green-600 mt-2">Scheduled demo sessions</p>
          </div>

          {/* Pending Requests */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Pending</p>
                <p className="text-3xl font-bold text-orange-700 mt-2">{stats.pendingDemos || 0}</p>
              </div>
              <svg className="w-12 h-12 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-orange-600 mt-2">Awaiting action</p>
          </div>

          {/* Active Tutors */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Tutors</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">{stats.activeTutors || 0}</p>
              </div>
              <svg className="w-12 h-12 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-purple-600 mt-2">Verified and active</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onNavigateToAdminDashboard}
            className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition shadow-md"
          >
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div className="text-left">
              <p className="font-semibold">Dashboard</p>
              <p className="text-xs opacity-90">View analytics</p>
            </div>
          </button>

          <button
            onClick={onNavigateToAdminBooking}
            className="flex items-center p-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:from-teal-600 hover:to-cyan-700 transition shadow-md"
          >
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-left">
              <p className="font-semibold">Demo Booking</p>
              <p className="text-xs opacity-90">Manage demos</p>
            </div>
          </button>

          <button
            onClick={onNavigateToTutorPool}
            className="flex items-center p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition shadow-md"
          >
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div className="text-left">
              <p className="font-semibold">Tutor Pool</p>
              <p className="text-xs opacity-90">Manage tutors</p>
            </div>
          </button>
        </div>

        {/* System Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-600">User ID:</span>
              <span className="font-mono text-gray-900">{user.id}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Role:</span>
              <span className="font-semibold text-purple-600">{user.role}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Provider:</span>
              <span className="text-gray-900">{user.provider || 'LOCAL'}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600 font-semibold">{user.status || 'ACTIVE'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileSection;
