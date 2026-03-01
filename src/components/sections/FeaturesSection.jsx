import SectionWrapper from '../layout/SectionWrapper';
import Card from '../ui/Card';

const FeaturesSection = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Location-Based Matching',
      description: 'Find tutors within 2km–10km radius of your home for convenient access.',
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Verified Profiles',
      description: 'Admin-approved tutors with background verification for your peace of mind.',
      color: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Demo Before Commitment',
      description: 'Book a free trial session to ensure the tutor is the right fit.',
      color: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Transparent Pricing',
      description: 'Compare tutor rates upfront. No hidden fees or surprise charges.',
      color: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-50',
    },
  ];

  return (
    <SectionWrapper background="gray" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
      </div>

      <div className="text-center mb-16 relative z-10 animate-fadeIn">
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-full shadow-sm mb-4">
          <span className="text-teal-600 font-semibold text-sm">✨ Our Features</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Why Choose <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">GyaanSetu</span>?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We make finding the perfect home tutor simple, safe, and transparent
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 animate-slideUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
            
            {/* Decorative gradient line */}
            <div className={`w-0 h-1 bg-gradient-to-r ${feature.color} mt-6 mx-auto rounded-full group-hover:w-16 transition-all duration-500`}></div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default FeaturesSection;
