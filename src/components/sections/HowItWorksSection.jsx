import SectionWrapper from '../layout/SectionWrapper';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Search Tutor by Subject & Area',
      description: 'Enter your location, subject, and grade to find matching tutors nearby.',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Compare Profiles',
      description: 'Review tutor qualifications, experience, ratings, and pricing to make an informed choice.',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Request Demo',
      description: 'Book a free demo session to assess teaching style and compatibility.',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Start Learning at Home',
      description: 'Once satisfied, begin regular lessons with your chosen tutor.',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  return (
    <SectionWrapper background="white" className="py-16 md:py-20" id="how-it-works">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          How GyaanSetu Works
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Getting started is simple. Follow these easy steps to find your perfect tutor
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Connector Line (hidden on mobile, last item) */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-300 to-primary-200 -z-10"></div>
            )}

            <div className="text-center">
              {/* Icon Circle */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-bg flex items-center justify-center shadow-xl relative z-10">
                {step.icon}
              </div>

              {/* Step Number */}
              <div className="text-5xl font-bold text-primary-200 mb-3">
                {step.number}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default HowItWorksSection;
