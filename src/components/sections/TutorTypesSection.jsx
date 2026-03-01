import SectionWrapper from '../layout/SectionWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';

const TutorTypesSection = () => {
  const plans = [
    {
      name: 'Free Tutor',
      icon: '🆓',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        '5 demos/month',
        'Basic profile visibility',
        'Standard support',
        'Email notifications',
      ],
      popular: false,
      gradient: 'from-gray-500 to-gray-600',
    },
    {
      name: 'Hero Tutor',
      icon: '⭐',
      price: '₹499/mo',
      description: 'Most popular among tutors',
      features: [
        'Unlimited demos',
        'Better search ranking',
        'Priority support',
        'Performance analytics',
        'Featured badge',
      ],
      popular: true,
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      name: 'Special Tutor',
      icon: '👑',
      price: '₹999/mo',
      description: 'Maximum visibility & growth',
      features: [
        'Everything in Hero',
        'Top search priority',
        'Highlighted profile',
        'Promotional alerts',
        'Dedicated support',
        'Custom branding',
      ],
      popular: false,
      gradient: 'from-yellow-500 to-orange-600',
    },
  ];

  return (
    <SectionWrapper background="gradient" className="py-16 md:py-20" id="tutor-types">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Flexible Plans for Tutors
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your teaching goals and grow your tutoring business
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            hover
            className={`relative ${plan.popular ? 'ring-2 ring-primary-500 shadow-2xl scale-105' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-600 to-primary-400 text-white text-sm font-semibold rounded-full shadow-lg">
                Most Popular
              </div>
            )}

            <div className="text-center mb-6">
              <div className="text-5xl mb-4">{plan.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              <div className="text-4xl font-bold gradient-text mb-1">
                {plan.price}
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.popular ? 'primary' : 'secondary'}
              className="w-full"
            >
              {plan.price === 'Free' ? 'Get Started' : 'Upgrade Now'}
            </Button>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default TutorTypesSection;
