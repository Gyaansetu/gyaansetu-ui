import SectionWrapper from '../layout/SectionWrapper';

const StatsSection = () => {
  const stats = [
    { number: '15K+', label: 'Students', icon: '👨‍🎓', color: 'from-blue-500 to-cyan-500' },
    { number: '75%', label: 'Total success', icon: '📈', color: 'from-green-500 to-emerald-500' },
    { number: '35', label: 'Main questions', icon: '❓', color: 'from-purple-500 to-pink-500' },
    { number: '26', label: 'Chief experts', icon: '👨‍🏫', color: 'from-orange-500 to-red-500' },
    { number: '16', label: 'Years of experience', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <SectionWrapper background="white" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-transparent to-cyan-50/50"></div>
      
      <div className="text-center mb-20 relative z-10 animate-fadeIn">
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-full shadow-sm mb-4">
          <span className="text-teal-600 font-semibold text-sm">📊 Our Impact</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
          Our <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Success</span>
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
          Connecting parents and qualified tutors across India. Building trust through transparency, 
          verified profiles, and successful learning outcomes that speak for themselves.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 px-4 relative z-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center group animate-scaleIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative inline-block mb-4">
              {/* Icon background */}
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} opacity-10 absolute inset-0 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-500`}></div>
              
              {/* Number */}
              <div className={`relative text-5xl md:text-6xl lg:text-7xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                {stat.number}
              </div>
              
              {/* Icon emoji */}
              <div className="absolute -top-2 -right-2 text-2xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                {stat.icon}
              </div>
            </div>
            
            <div className="text-base md:text-lg text-gray-700 font-semibold mt-4">
              {stat.label}
            </div>
            
            {/* Progress bar */}
            <div className="w-16 h-1 mx-auto mt-3 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${stat.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000`}></div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default StatsSection;
