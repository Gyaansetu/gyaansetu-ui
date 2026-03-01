import { useState } from 'react';

const TutorFilters = ({ filters, setFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science', 'History', 'Geography', 'Economics'];

  const genders = ['Male', 'Female', 'Any'];

  const ratings = [
    { label: '4+ Stars', value: 4 },
    { label: '3+ Stars', value: 3 },
    { label: '2+ Stars', value: 2 },
    { label: 'All Ratings', value: 0 },
  ];

  const handleClassToggle = (className) => {
    setFilters((prev) => ({
      ...prev,
      class: prev.class.includes(className)
        ? prev.class.filter((c) => c !== className)
        : [...prev.class, className],
    }));
  };

  const handleSubjectToggle = (subject) => {
    setFilters((prev) => ({
      ...prev,
      subject: prev.subject.includes(subject)
        ? prev.subject.filter((s) => s !== subject)
        : [...prev.subject, subject],
    }));
  };

  const handleClearAll = () => {
    setFilters({
      class: [],
      subject: [],
      gender: '',
      minFees: 0,
      maxFees: 10000,
      minRating: 0,
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-100">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="lg:hidden w-full flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200 hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900">Filters</span>
        </div>
        <svg
          className={`w-5 h-5 text-teal-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block space-y-6`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Filters</h3>
          </div>
          <button
            onClick={handleClearAll}
            className="text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 text-red-600 hover:from-red-200 hover:to-pink-200 transition-all border border-red-200"
          >
            Clear All
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* Class Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-lg">📘</span>
            </div>
            <h4 className="text-sm font-bold text-gray-900">Class</h4>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
            {classes.map((className) => (
              <label key={className} className="flex items-center cursor-pointer group p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.class.includes(className)}
                    onChange={() => handleClassToggle(className)}
                    className="w-5 h-5 rounded-lg border-2 border-gray-300 cursor-pointer checked:bg-gradient-to-r checked:from-teal-500 checked:to-cyan-600 checked:border-teal-500 transition-all"
                  />
                  {filters.class.includes(className) && (
                    <svg className="w-3 h-3 text-white absolute top-1 left-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {className}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* Subject Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-lg">📚</span>
            </div>
            <h4 className="text-sm font-bold text-gray-900">Subject</h4>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
            {subjects.map((subject) => (
              <label key={subject} className="flex items-center cursor-pointer group p-2 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-100 transition-all">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.subject.includes(subject)}
                    onChange={() => handleSubjectToggle(subject)}
                    className="w-5 h-5 rounded-lg border-2 border-gray-300 cursor-pointer checked:bg-gradient-to-r checked:from-teal-500 checked:to-cyan-600 checked:border-teal-500 transition-all"
                  />
                  {filters.subject.includes(subject) && (
                    <svg className="w-3 h-3 text-white absolute top-1 left-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {subject}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* Gender Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-lg">👥</span>
            </div>
            <h4 className="text-sm font-bold text-gray-900">Gender</h4>
          </div>
          <div className="space-y-2.5">
            {genders.map((gender) => (
              <label key={gender} className="flex items-center cursor-pointer group p-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-100 transition-all">
                <div className="relative">
                  <input
                    type="radio"
                    name="gender"
                    checked={filters.gender === gender}
                    onChange={() => setFilters((prev) => ({ ...prev, gender }))}
                    className="w-5 h-5 cursor-pointer border-2 border-gray-300 checked:border-teal-500"
                    style={{ accentColor: '#14b8a6' }}
                  />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {gender}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* Fees Range Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-lg">💰</span>
            </div>
            <h4 className="text-sm font-bold text-gray-900">Tutor Fees (per month)</h4>
          </div>
          <div className="space-y-5 p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700">Minimum</label>
                <span className="text-sm font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">₹{filters.minFees}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={filters.minFees}
                onChange={(e) => setFilters((prev) => ({ ...prev, minFees: parseInt(e.target.value) }))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-teal"
                style={{ 
                  background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${(filters.minFees / 10000) * 100}%, #e5e7eb ${(filters.minFees / 10000) * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700">Maximum</label>
                <span className="text-sm font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">₹{filters.maxFees}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={filters.maxFees}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxFees: parseInt(e.target.value) }))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-teal"
                style={{ 
                  background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${(filters.maxFees / 10000) * 100}%, #e5e7eb ${(filters.maxFees / 10000) * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* Rating Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-lg">⭐</span>
            </div>
            <h4 className="text-sm font-bold text-gray-900">Rating</h4>
          </div>
          <div className="space-y-2.5">
            {ratings.map((rating) => (
              <label key={rating.value} className="flex items-center cursor-pointer group p-2 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-100 transition-all">
                <div className="relative">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === rating.value}
                    onChange={() => setFilters((prev) => ({ ...prev, minRating: rating.value }))}
                    className="w-5 h-5 cursor-pointer border-2 border-gray-300 checked:border-teal-500"
                    style={{ accentColor: '#14b8a6' }}
                  />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 flex items-center gap-1.5">
                  {rating.label}
                  {rating.value > 0 && (
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorFilters;
