import { useState, useEffect, useCallback, useRef } from 'react';
import SectionWrapper from '../layout/SectionWrapper';

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
    {
      name: 'Suresh Patel',
      role: 'Parent, Ahmedabad',
      image: 'https://ui-avatars.com/api/?name=Suresh+Patel&background=0891b2&color=fff&size=80',
      rating: 5,
      text: 'Within 2 days of signing up, I found an experienced science tutor just 3 km away. The verification process gave me complete confidence in the tutor we chose.',
    },
    {
      name: 'Meena Joshi',
      role: 'Tutor, Pune',
      image: 'https://ui-avatars.com/api/?name=Meena+Joshi&background=7c3aed&color=fff&size=80',
      rating: 5,
      text: 'GyaanSetu helped me build a full schedule within a month. Parents trust the platform, and so do I. My student base doubled without spending a single rupee on promotion.',
    },
  ];

  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('right'); // 'left' or 'right'
  const timeoutRef = useRef();

  const goTo = useCallback((index, dir = 'right') => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, 350);
  }, [isAnimating]);

  const prev = useCallback(() => {
    goTo((current - 1 + testimonials.length) % testimonials.length, 'left');
  }, [current, goTo, testimonials.length]);

  const next = useCallback(() => {
    goTo((current + 1) % testimonials.length, 'right');
  }, [current, goTo, testimonials.length]);

  useEffect(() => {
    timeoutRef.current = setInterval(() => {
      goTo((c => (c + 1) % testimonials.length)(current), 'right');
    }, 4000);
    return () => clearInterval(timeoutRef.current);
    // eslint-disable-next-line
  }, [current, goTo, testimonials.length]);

  const t = testimonials[current];

  return (
    <SectionWrapper id="testimonials" background="white" className="py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          What They Say
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Real experiences from parents and tutors using GyaanSetu
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto overflow-hidden" style={{minHeight: 340}}>
        {/* Card with sliding animation */}
        <div
          className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-10 md:p-14 absolute left-0 right-0 transition-transform duration-350 ease-in-out
            ${isAnimating
              ? direction === 'right'
                ? '-translate-x-full opacity-0'
                : 'translate-x-full opacity-0'
              : 'translate-x-0 opacity-100'}
          `}
          key={current}
        >
          {/* Stars */}
          <div className="flex gap-1 mb-6 justify-center">
            {[...Array(t.rating)].map((_, i) => (
              <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Quote */}
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed text-center italic mb-8">
            "{t.text}"
          </p>

          {/* Author */}
          <div className="flex items-center justify-center gap-4">
            <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full ring-2 ring-teal-200" />
            <div className="text-left">
              <div className="font-semibold text-gray-900 text-lg">{t.name}</div>
              <div className="text-sm text-teal-600">{t.role}</div>
            </div>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-8 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-teal-600 hover:shadow-xl transition-all duration-200 z-10"
          aria-label="Previous testimonial"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-8 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-teal-600 hover:shadow-xl transition-all duration-200 z-10"
          aria-label="Next testimonial"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 'right' : 'left')}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-8 h-3 bg-teal-500'
                : 'w-3 h-3 bg-gray-300 hover:bg-teal-300'
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default TestimonialsSection;
