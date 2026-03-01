import { useState, useEffect } from 'react';
import TutorCard from '../cards/TutorCard';
import tutorService from '../../services/tutorService';

const TutorGrid = ({ searchQuery, filters, onBookDemo }) => {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tutors based on city and state from filters
  useEffect(() => {
    const fetchTutors = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let response;
        
        // Check if user has set any specific location/subject/class filters
        const hasLocationFilter = filters.city || filters.state;
        const hasSubjectFilter = filters.subjectId;
        const hasClassFilter = filters.classLevelId;
        
        if (hasLocationFilter || hasSubjectFilter || hasClassFilter) {
          // User has applied filters - use search endpoint
          response = await tutorService.searchTutors({
            city: filters.city,
            state: filters.state,
            subjectId: filters.subjectId,
            classLevelId: filters.classLevelId,
          });
        } else {
          // No filters applied - fetch ALL tutors
          response = await tutorService.getAllTutors();
        }

        
        // Response is already the array (interceptor extracts data from ApiResponse wrapper)
        const tutorData = Array.isArray(response) ? response : (response.data || []);
        
        // Map backend response to frontend structure
        const mappedTutors = tutorData.map((tutor) => ({
          id: tutor.tutorId,
          name: tutor.name,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=14b8a6&color=fff&size=200`,
          classes: tutor.classLevels || [],
          subjects: tutor.subjects || [],
          languages: ['English', 'Hindi'], // Not available in backend
          experience: tutor.experience || 0,
          rating: 4.5, // Not available in backend, using default
          reviewCount: 0, // Not available in backend
          pricePerMonth: 3000, // Not available in backend, using default
          gender: tutor.gender || 'Not specified',
          bio: tutor.profileSummary || 'Experienced tutor ready to help you succeed.',
          qualification: tutor.qualification || '',
          email: tutor.email,
          phone: tutor.phone,
          location: tutor.location,
        }));

                setTutors(mappedTutors);
        setFilteredTutors(mappedTutors);
      } catch (err) {
                setError(err.message || 'Failed to load tutors');
        // Use empty array on error
        setTutors([]);
        setFilteredTutors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutors();
  }, [filters.city, filters.state, filters.subjectId, filters.classLevelId]);

  // Apply client-side filtering when search query or filters change
  useEffect(() => {
    if (tutors.length === 0) {
      setFilteredTutors([]);
      return;
    }

    let result = [...tutors];

    // Filter by search query
    if (searchQuery) {
      result = result.filter((tutor) =>
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.subjects.some((subject) => subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tutor.classes.some((cls) => cls.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by class
    if (filters.class && filters.class.length > 0) {
      result = result.filter((tutor) =>
        tutor.classes.some((c) => filters.class.includes(c))
      );
    }

    // Filter by subject
    if (filters.subject && filters.subject.length > 0) {
      result = result.filter((tutor) =>
        tutor.subjects.some((s) => filters.subject.includes(s))
      );
    }

    // Filter by gender
    if (filters.gender && filters.gender !== 'Any') {
      result = result.filter((tutor) => tutor.gender === filters.gender);
    }

    // Filter by fees
    if (filters.minFees !== undefined && filters.maxFees !== undefined) {
      result = result.filter(
        (tutor) => tutor.pricePerMonth >= filters.minFees && tutor.pricePerMonth <= filters.maxFees
      );
    }

    // Filter by rating
    if (filters.minRating && filters.minRating > 0) {
      result = result.filter((tutor) => tutor.rating >= filters.minRating);
    }

    setFilteredTutors(result);
  }, [searchQuery, filters, tutors]);

  // Error state
  if (error) {
    return (
      <div className="text-center py-20">
        <svg className="mx-auto h-24 w-24 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="mt-6 text-xl font-semibold text-gray-900">Failed to load tutors</h3>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-teal-500"></div>
          <p className="mt-4 text-gray-600">Finding the best tutors for you...</p>
        </div>
      </div>
    );
  }

  if (filteredTutors.length === 0) {
    return (
      <div className="text-center py-20">
        <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-6 text-xl font-semibold text-gray-900">No tutors found</h3>
        <p className="mt-2 text-gray-600">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {filteredTutors.length} Tutor{filteredTutors.length !== 1 ? 's' : ''} Available
        </h2>
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          style={{ accentColor: '#14b8a6' }}
        >
          <option>Most Relevant</option>
          <option>Highest Rated</option>
          <option>Lowest Price</option>
          <option>Highest Price</option>
          <option>Most Experienced</option>
        </select>
      </div>

      {/* Tutor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTutors.map((tutor, index) => (
          <TutorCard 
            key={tutor.id} 
            tutor={tutor} 
            onBookDemo={onBookDemo}
            delay={index * 100}
          />
        ))}
      </div>
    </div>
  );
};

export default TutorGrid;
