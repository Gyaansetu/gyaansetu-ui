import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import tutorPoolService from '../services/tutorPoolService';

const AdminDemoBookingPage = ({ onOpenLogin, onOpenRegister, onNavigateToFindTutor, onNavigateToProfile, onNavigateToAdminBooking, onNavigateToAdminDashboard, onNavigateToTutorPool, onNavigateHome }) => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [formData, setFormData] = useState({
    parentName: '',
    phoneNumber: '',
    houseNumber: '',
    area: '',
    city: '',
    state: '',
    selectedClasses: [],
    selectedSubjects: [],
    pricePerMonth: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  
  const classDropdownRef = useRef(null);
  const subjectDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (classDropdownRef.current && !classDropdownRef.current.contains(event.target)) {
        setShowClassDropdown(false);
      }
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target)) {
        setShowSubjectDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock data - will come from backend API
  const classList = [
    { id: 1, name: 'Class 1', level: 1 },
    { id: 2, name: 'Class 2', level: 2 },
    { id: 3, name: 'Class 3', level: 3 },
    { id: 4, name: 'Class 4', level: 4 },
    { id: 5, name: 'Class 5', level: 5 },
    { id: 6, name: 'Class 6', level: 6 },
    { id: 7, name: 'Class 7', level: 7 },
    { id: 8, name: 'Class 8', level: 8 },
    { id: 9, name: 'Class 9', level: 9 },
    { id: 10, name: 'Class 10', level: 10 },
    { id: 11, name: 'Class 11', level: 11 },
    { id: 12, name: 'Class 12', level: 12 },
  ];

  const subjectList = [
    { id: 0, name: 'All Subjects', category: 'General' }, // Added ALL option
    { id: 1, name: 'Mathematics', category: 'Science' },
    { id: 2, name: 'Physics', category: 'Science' },
    { id: 3, name: 'Chemistry', category: 'Science' },
    { id: 4, name: 'Biology', category: 'Science' },
    { id: 5, name: 'English', category: 'Language' },
    { id: 6, name: 'Hindi', category: 'Language' },
    { id: 7, name: 'Social Studies', category: 'Arts' },
    { id: 8, name: 'Computer Science', category: 'Science' },
    { id: 9, name: 'Accountancy', category: 'Commerce' },
    { id: 10, name: 'Business Studies', category: 'Commerce' },
    { id: 11, name: 'Economics', category: 'Commerce' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleClassSelection = (classId) => {
    setFormData(prev => {
      const isSelected = prev.selectedClasses.includes(classId);
      return {
        ...prev,
        selectedClasses: isSelected
          ? prev.selectedClasses.filter(id => id !== classId)
          : [...prev.selectedClasses, classId]
      };
    });
    // Clear error when user makes selection
    if (errors.selectedClasses) {
      setErrors(prev => ({ ...prev, selectedClasses: '' }));
    }
  };

  const toggleSubjectSelection = (subjectId) => {
    setFormData(prev => {
      const isSelected = prev.selectedSubjects.includes(subjectId);
      return {
        ...prev,
        selectedSubjects: isSelected
          ? prev.selectedSubjects.filter(id => id !== subjectId)
          : [...prev.selectedSubjects, subjectId]
      };
    });
    // Clear error when user makes selection
    if (errors.selectedSubjects) {
      setErrors(prev => ({ ...prev, selectedSubjects: '' }));
    }
  };

  const removeClass = (classId) => {
    setFormData(prev => ({
      ...prev,
      selectedClasses: prev.selectedClasses.filter(id => id !== classId)
    }));
  };

  const removeSubject = (subjectId) => {
    setFormData(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.filter(id => id !== subjectId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Parent name is required';
    } else if (formData.parentName.trim().length < 3) {
      newErrors.parentName = 'Name must be at least 3 characters';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.replace(/\s+/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!formData.houseNumber.trim()) {
      newErrors.houseNumber = 'House/Flat number is required';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area/Locality is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (formData.selectedClasses.length === 0) {
      newErrors.selectedClasses = 'Please select at least one class';
    }

    if (formData.selectedSubjects.length === 0) {
      newErrors.selectedSubjects = 'Please select at least one subject';
    }

    if (!formData.pricePerMonth.trim()) {
      newErrors.pricePerMonth = 'Price per month is required';
    } else if (isNaN(formData.pricePerMonth) || Number(formData.pricePerMonth) <= 0) {
      newErrors.pricePerMonth = 'Please enter a valid price';
    } else if (Number(formData.pricePerMonth) < 500) {
      newErrors.pricePerMonth = 'Minimum price is ₹500';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map frontend data to backend enum format
      const requestData = {
        parentName: formData.parentName.trim(),
        phoneNumber: formData.phoneNumber.replace(/\s+/g, ''), // Remove spaces
        houseNumber: formData.houseNumber.trim(),
        area: formData.area.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        classLevels: formData.selectedClasses.map(id => {
          const classItem = classList.find(c => c.id === id);
          return `CLASS_${classItem.level}`;
        }),
        subjects: formData.selectedSubjects.map(id => {
          const subject = subjectList.find(s => s.id === id);
          // Special handling for "All Subjects" -> "ALL"
          if (id === 0) {
            return 'ALL';
          }
          return subject.name.toUpperCase().replace(/\s+/g, '_');
        }),
        pricePerMonth: parseFloat(formData.pricePerMonth),
      };

      
      // Call backend API
      const response = await tutorPoolService.createEvent(requestData);

                        
      // Backend returns ApiResponse with { success, message, data, timestamp }
      if (response && response.success !== false) {
        const eventId = response.data?.id || response.id;
        showSuccess(`Demo booking created successfully for ${formData.parentName}! Event ID: #TP${String(eventId).padStart(3, '0')}`, 5000);

        // Reset form
        setFormData({
          parentName: '',
          phoneNumber: '',
          houseNumber: '',
          area: '',
          city: '',
          state: '',
          selectedClasses: [],
          selectedSubjects: [],
          pricePerMonth: '',
        });
      } else {
        showError(response?.message || 'Failed to create demo booking');
      }
    } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create demo booking. Please try again.';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onOpenLogin={onOpenLogin} 
        onOpenRegister={onOpenRegister} 
        onNavigateToFindTutor={onNavigateToFindTutor}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToAdminBooking={onNavigateToAdminBooking}
        onNavigateToAdminDashboard={onNavigateToAdminDashboard}
        onNavigateToTutorPool={onNavigateToTutorPool}
        onNavigateHome={onNavigateHome}
        currentPage="admin-booking"
      />

      <main className="pt-20 pb-12">
        {/* Banner Section - Seamless with navbar */}
        <div className="bg-teal-500 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Admin Demo Booking Portal
            </h1>
            <p className="text-lg md:text-xl text-teal-50">
              Create demo booking requests on behalf of parents during phone calls
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Info Card */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">Important Instructions</h3>
                  <p className="text-sm text-blue-800">
                    Fill out this form while on call with the parent. Ensure all details are accurate before submitting the demo booking request.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Parent Name */}
              <div>
                <label htmlFor="parentName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Parent's Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="parentName"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                    errors.parentName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter parent's full name"
                />
                {errors.parentName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.parentName}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Address Fields - Broken Down */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* House Number */}
                <div>
                  <label htmlFor="houseNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    House/Flat Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="houseNumber"
                    name="houseNumber"
                    value={formData.houseNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.houseNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 123, Block A, 2nd Floor"
                  />
                  {errors.houseNumber && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.houseNumber}
                    </p>
                  )}
                </div>

                {/* Area */}
                <div>
                  <label htmlFor="area" className="block text-sm font-semibold text-gray-700 mb-2">
                    Area/Locality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.area ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Sector 15, Rohini"
                  />
                  {errors.area && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.area}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., New Delhi"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Delhi"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>

              {/* Class and Subject in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class Selection */}
                <div className="relative" ref={classDropdownRef}>
                  <label htmlFor="selectedClasses" className="block text-sm font-semibold text-gray-700 mb-2">
                    Class <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Selected Classes Display */}
                  <div 
                    onClick={() => setShowClassDropdown(!showClassDropdown)}
                    className={`w-full min-h-[48px] px-4 py-2 border rounded-lg cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.selectedClasses ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {formData.selectedClasses.length === 0 ? (
                      <span className="text-gray-400">Select Classes</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {formData.selectedClasses.map(classId => {
                          const cls = classList.find(c => c.id === classId);
                          return (
                            <span 
                              key={classId}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                            >
                              {cls?.name}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeClass(classId);
                                }}
                                className="hover:bg-teal-200 rounded-full p-0.5 transition-colors"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Dropdown Options */}
                  {showClassDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {classList.map(cls => {
                        const isSelected = formData.selectedClasses.includes(cls.id);
                        return (
                          <div
                            key={cls.id}
                            onClick={() => toggleClassSelection(cls.id)}
                            className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                              isSelected 
                                ? 'bg-teal-50 text-teal-700 font-medium' 
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <span>{cls.name}</span>
                            {isSelected && (
                              <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {errors.selectedClasses && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.selectedClasses}
                    </p>
                  )}
                </div>

                {/* Subject Selection */}
                <div className="relative" ref={subjectDropdownRef}>
                  <label htmlFor="selectedSubjects" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Selected Subjects Display */}
                  <div 
                    onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                    className={`w-full min-h-[48px] px-4 py-2 border rounded-lg cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.selectedSubjects ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {formData.selectedSubjects.length === 0 ? (
                      <span className="text-gray-400">Select Subjects</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {formData.selectedSubjects.map(subjectId => {
                          const subject = subjectList.find(s => s.id === subjectId);
                          return (
                            <span 
                              key={subjectId}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                            >
                              {subject?.name}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSubject(subjectId);
                                }}
                                className="hover:bg-teal-200 rounded-full p-0.5 transition-colors"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Dropdown Options */}
                  {showSubjectDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {subjectList.map(subject => {
                        const isSelected = formData.selectedSubjects.includes(subject.id);
                        return (
                          <div
                            key={subject.id}
                            onClick={() => toggleSubjectSelection(subject.id)}
                            className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                              isSelected 
                                ? 'bg-teal-50 text-teal-700 font-medium' 
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <div>
                              <div>{subject.name}</div>
                              <div className="text-xs text-gray-500">{subject.category}</div>
                            </div>
                            {isSelected && (
                              <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {errors.selectedSubjects && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.selectedSubjects}
                    </p>
                  )}
                </div>
              </div>

              {/* Price Per Month */}
              <div>
                <label htmlFor="pricePerMonth" className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Per Month (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input
                    type="number"
                    id="pricePerMonth"
                    name="pricePerMonth"
                    value={formData.pricePerMonth}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.pricePerMonth ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter monthly price (min ₹500)"
                    min="500"
                  />
                </div>
                {errors.pricePerMonth && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.pricePerMonth}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Book Demo Session
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-teal-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-teal-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Need Help?
            </h3>
            <p className="text-sm text-teal-800">
              For any issues or questions about creating demo bookings, contact the technical support team at{' '}
              <a href="mailto:support@gyaansetu.com" className="font-semibold underline">support@gyaansetu.com</a>
              {' '}or call <span className="font-semibold">1800-XXX-XXXX</span>
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
    </div>
  );
};

export default AdminDemoBookingPage;
