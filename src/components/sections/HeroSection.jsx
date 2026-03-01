const HeroSection = ({ onOpenRegister }) => {
  return (
    <section className="relative pt-32 md:pt-36 pb-24 md:pb-32 overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-delayed"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-slow"></div>
      </div>

      {/* Curved bottom edge */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-32 md:h-40"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left z-10 animate-slideInLeft">
            <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6 animate-bounce-subtle">
              <span className="text-teal-600 font-semibold text-sm">🎓 Welcome to the Future of Learning</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Finding Tutors{' '}
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                at Your Doorstep
              </span>{' '}
              is now much easier
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0">
              GyaanSetu is an interesting platform that will connect you with qualified tutors in a more interactive way
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <button
                onClick={onOpenRegister}
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-full hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 text-lg shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/40 hover:scale-105 group"
              >
                <span className="flex items-center gap-2">
                  Join for free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition-colors group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <svg className="w-7 h-7 text-teal-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="font-semibold text-lg">Watch how it works</span>
              </button>
            </div>
          </div>

          {/* Right Content - Student Image with Floating Cards */}
          <div className="relative hidden lg:block animate-slideInRight">
            <div className="relative w-full h-[550px]">
              {/* Student placeholder - you should replace with actual image */}
              <div className="absolute inset-0 flex items-end justify-center opacity-20">
                <div className="w-96 h-full bg-gradient-to-t from-teal-200 to-transparent rounded-t-full"></div>
              </div>

              {/* 15k+ Students Card */}
              <div className="absolute top-10 left-0 bg-white rounded-2xl shadow-2xl p-5 w-60 animate-float hover-lift border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">15k+</p>
                    <p className="text-sm text-gray-600 font-medium">Students</p>
                    <p className="text-sm text-gray-500">Connected</p>
                  </div>
                </div>
              </div>

              {/* Congratulations Card */}
              <div className="absolute top-40 right-0 bg-white rounded-2xl shadow-2xl p-5 w-72 animate-float-delayed hover-lift border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">Congratulations!</p>
                    <p className="text-sm text-gray-600 mt-1">Your demo is confirmed</p>
                    <p className="text-xs text-teal-600 mt-2 font-medium">🎉 Get ready to learn</p>
                  </div>
                </div>
              </div>

              {/* Demo Session Card */}
              <div className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-2xl p-5 w-80 animate-float hover-lift border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img
                      src="https://ui-avatars.com/api/?name=Priya+Sharma&background=14b8a6&color=fff&size=48"
                      alt="Tutor"
                      className="w-12 h-12 rounded-full ring-2 ring-teal-500"
                    />
                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white absolute bottom-0 right-0 animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900">Demo Session</p>
                    <p className="text-sm text-gray-500">Today at 12.00 PM</p>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-base font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105">
                  Join Now
                </button>
              </div>

              {/* Chart Icon */}
              <div className="absolute top-0 right-8 w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl animate-float-delayed hover:scale-110 transition-transform cursor-pointer">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
