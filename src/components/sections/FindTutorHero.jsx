const FindTutorHero = ({ searchQuery, setSearchQuery }) => {
  return (
    <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-floatSlow"></div>
        <div className="absolute -bottom-10 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full mb-4 sm:mb-6 border border-teal-200 animate-slideUp">
            <span className="text-xl sm:text-2xl">🎓</span>
            <span className="text-xs sm:text-sm font-semibold text-teal-700">Discover Expert Tutors</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 animate-fadeIn px-2">
            <span className="text-gray-900">Find Your</span>
            <br />
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Perfect Tutor
            </span>
          </h1>
          
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slideUp px-4">
            Connect with qualified tutors tailored to your learning needs. 
            <br className="hidden sm:block" />
            <span className="font-semibold text-teal-600">Start your journey to success today!</span>
          </p>
        </div>

        {/* Modern Search Bar */}
        <div className="max-w-4xl mx-auto mb-12 animate-scaleIn">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-2 sm:p-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                {/* Search Icon - Hidden on mobile, visible on larger screens */}
                <div className="hidden sm:flex pl-2 sm:pl-4 items-center justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                {/* Input with icon on mobile */}
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 sm:hidden">
                    <svg className="h-5 w-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, subject, or expertise..."
                    className="w-full pl-10 sm:pl-4 pr-4 py-3 sm:py-4 text-base sm:text-lg bg-transparent border-0 focus:outline-none placeholder-gray-400"
                  />
                </div>
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto px-2 sm:px-0">
          {[
            { label: 'Expert Tutors', value: '500+', icon: '👨‍🏫', gradient: 'from-blue-500 to-blue-600' },
            { label: 'Subjects', value: '50+', icon: '📚', gradient: 'from-green-500 to-emerald-600' },
            { label: 'Success Rate', value: '95%', icon: '🎯', gradient: 'from-purple-500 to-violet-600' },
            { label: 'Happy Students', value: '15K+', icon: '⭐', gradient: 'from-orange-500 to-amber-600' },
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br ${stat.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                <span className="text-xl sm:text-3xl">{stat.icon}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1 sm:mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FindTutorHero;
