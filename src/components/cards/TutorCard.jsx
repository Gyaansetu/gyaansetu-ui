import { useState } from 'react';

const TutorCard = ({ tutor, onBookDemo, delay = 0 }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-6">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-teal-50 group-hover:ring-teal-100 transition-all">
              {!imageError ? (
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                  {tutor.name.charAt(0)}
                </div>
              )}
            </div>
            {/* Online Badge */}
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
          </div>

          {/* Name and Rating */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-teal-600 transition-colors">
              {tutor.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-gray-900">{tutor.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({tutor.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tutor.bio}</p>

        {/* Details Grid */}
        <div className="space-y-3 mb-5">
          {/* Classes */}
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Classes</p>
              <div className="flex flex-wrap gap-1">
                {tutor.classes.slice(0, 3).map((cls) => (
                  <span key={cls} className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                    {cls}
                  </span>
                ))}
                {tutor.classes.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    +{tutor.classes.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Subjects</p>
              <p className="text-sm font-medium text-gray-900">{tutor.subjects.join(', ')}</p>
            </div>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <p className="text-sm text-gray-600">{tutor.languages.join(', ')}</p>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-600">{tutor.experience} years experience</p>
          </div>
        </div>

        {/* Price and Book Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Starting from</p>
            <p className="text-2xl font-bold" style={{ color: '#14b8a6' }}>
              ₹{tutor.pricePerMonth.toLocaleString()}
              <span className="text-sm font-normal text-gray-500">/month</span>
            </p>
          </div>
          <button
            onClick={() => onBookDemo(tutor)}
            className="px-6 py-3 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            style={{ backgroundColor: '#14b8a6' }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#0d9488')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#14b8a6')}
          >
            Book Demo
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TutorCard;
