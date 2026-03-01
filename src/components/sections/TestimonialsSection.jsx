import SectionWrapper from '../layout/SectionWrapper';
import Card from '../ui/Card';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Parent, Patna',
      image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=0d9488&color=fff&size=80',
      rating: 5,
      text: 'Finding a good maths tutor in Patna was so difficult before GyaanSetu. Now my daughter has a qualified teacher who comes home, and her grades have improved significantly!',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Tutor, Delhi',
      image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=14b8a6&color=fff&size=80',
      rating: 5,
      text: 'I now receive regular demo requests without depending on agents or paying hefty commissions. GyaanSetu has truly empowered independent tutors like me.',
    },
    {
      name: 'Anita Verma',
      role: 'Parent, Mumbai',
      image: 'https://ui-avatars.com/api/?name=Anita+Verma&background=2dd4bf&color=fff&size=80',
      rating: 5,
      text: 'The demo session feature is brilliant! We tried three tutors before finding the perfect match for our son. No pressure, completely transparent process.',
    },
  ];

  return (
    <SectionWrapper background="white" className="py-16 md:py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          What They Say
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Real experiences from parents and tutors using GyaanSetu
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} hover className="flex flex-col">
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow italic">
              "{testimonial.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-600">
                  {testimonial.role}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default TestimonialsSection;
