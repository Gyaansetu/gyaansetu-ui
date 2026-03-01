import { useState, useEffect, useRef } from 'react';
import Toast from '../common/Toast';
import useToast from '../../hooks/useToast';

// Updated to match backend enums
const availableSubjects = [
  { value: 'MATHEMATICS', label: 'Mathematics' },
  { value: 'PHYSICS', label: 'Physics' },
  { value: 'CHEMISTRY', label: 'Chemistry' },
  { value: 'BIOLOGY', label: 'Biology' },
  { value: 'ENGLISH', label: 'English' },
  { value: 'HINDI', label: 'Hindi' },
  { value: 'SANSKRIT', label: 'Sanskrit' },
  { value: 'SOCIAL_STUDIES', label: 'Social Studies' },
  { value: 'HISTORY', label: 'History' },
  { value: 'GEOGRAPHY', label: 'Geography' },
  { value: 'POLITICAL_SCIENCE', label: 'Political Science' },
  { value: 'ECONOMICS', label: 'Economics' },
  { value: 'COMPUTER_SCIENCE', label: 'Computer Science' },
  { value: 'ACCOUNTANCY', label: 'Accountancy' },
  { value: 'BUSINESS_STUDIES', label: 'Business Studies' },
  { value: 'PHYSICAL_EDUCATION', label: 'Physical Education' },
];

const availableClasses = [
  { value: 'CLASS_1', label: 'Class 1' },
  { value: 'CLASS_2', label: 'Class 2' },
  { value: 'CLASS_3', label: 'Class 3' },
  { value: 'CLASS_4', label: 'Class 4' },
  { value: 'CLASS_5', label: 'Class 5' },
  { value: 'CLASS_6', label: 'Class 6' },
  { value: 'CLASS_7', label: 'Class 7' },
  { value: 'CLASS_8', label: 'Class 8' },
  { value: 'CLASS_9', label: 'Class 9' },
  { value: 'CLASS_10', label: 'Class 10' },
  { value: 'CLASS_11', label: 'Class 11' },
  { value: 'CLASS_12', label: 'Class 12' },
];

const EditProfileModal = ({ isOpen, onClose, tutorData, onSave }) => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    qualification: '',
    experience: '',
    profileSummary: '',
    city: '',
    area: '',
    state: '',
    pincode: '',
    houseNo: '',
    selectedSubjects: [],
    selectedClasses: [],
  });

  const [errors, setErrors] = useState({});
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  
  const subjectDropdownRef = useRef(null);
  const classDropdownRef = useRef(null);

  // Update form data when tutorData changes
  useEffect(() => {
    if (tutorData && isOpen) {
      setFormData({
        name: tutorData?.user?.name || '',
        email: tutorData?.user?.email || '',
        phone: tutorData?.user?.phone || '',
        gender: tutorData?.tutorProfile?.gender || '',
        qualification: tutorData?.tutorProfile?.qualification || '',
        experience: tutorData?.tutorProfile?.experience || 0,
        profileSummary: tutorData?.tutorProfile?.profileSummary || '',
        city: tutorData?.tutorProfile?.location?.city || '',
        area: tutorData?.tutorProfile?.location?.area || '',
        state: tutorData?.tutorProfile?.location?.state || '',
        pincode: tutorData?.tutorProfile?.location?.pincode || '',
        houseNo: tutorData?.tutorProfile?.location?.houseNo || '',
        // Map subject display names to enum values
        selectedSubjects: (tutorData?.tutorProfile?.subjects || [])
          .map(subjectName => {
            // Find matching subject by label (display name)
            const found = availableSubjects.find(s => s.label === subjectName);
            return found ? found.value : null;
          })
          .filter(value => value !== null),
        // Map class display names to enum values
        selectedClasses: (tutorData?.tutorProfile?.classLevels || [])
          .map(className => {
            // Find matching class by label
            const found = availableClasses.find(c => c.label === className);
            return found ? found.value : null;
          })
          .filter(value => value !== null),
      });
    }
  }, [tutorData, isOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target)) {
        setShowSubjectDropdown(false);
      }
      if (classDropdownRef.current && !classDropdownRef.current.contains(event.target)) {
        setShowClassDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleSubjectSelection = (subjectValue) => {
    setFormData(prev => {
      const isSelected = prev.selectedSubjects.includes(subjectValue);
      return {
        ...prev,
        selectedSubjects: isSelected
          ? prev.selectedSubjects.filter(val => val !== subjectValue)
          : [...prev.selectedSubjects, subjectValue]
      };
    });
    if (errors.selectedSubjects) {
      setErrors(prev => ({ ...prev, selectedSubjects: '' }));
    }
  };

  const toggleClassSelection = (classValue) => {
    setFormData(prev => {
      const isSelected = prev.selectedClasses.includes(classValue);
      return {
        ...prev,
        selectedClasses: isSelected
          ? prev.selectedClasses.filter(val => val !== classValue)
          : [...prev.selectedClasses, classValue]
      };
    });
    if (errors.selectedClasses) {
      setErrors(prev => ({ ...prev, selectedClasses: '' }));
    }
  };

  const removeSubject = (subjectId) => {
    setFormData(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.filter(id => id !== subjectId)
    }));
  };

  const removeClass = (classId) => {
    setFormData(prev => ({
      ...prev,
      selectedClasses: prev.selectedClasses.filter(id => id !== classId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // All fields are optional for updates - only validate format if provided
    
    // Email validation (only if provided)
    if (formData.email && formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Phone validation (only if provided)
    if (formData.phone && formData.phone.trim() && !/^[+]?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone is invalid';
    }
    
    // Experience validation (only if provided)
    if (formData.experience && formData.experience < 0) {
      newErrors.experience = 'Experience cannot be negative';
    }
    
    // Profile summary validation (only if provided and has content)
    if (formData.profileSummary && formData.profileSummary.trim() && formData.profileSummary.trim().length < 50) {
      newErrors.profileSummary = 'Profile summary must be at least 50 characters if provided';
    }
    
    // Pincode validation (only if provided)
    if (formData.pincode && formData.pincode.trim() && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Only include fields that have values - user decides what to update
      const updateData = {};
      
      if (formData.name && formData.name.trim()) {
        updateData.name = formData.name;
      }
      if (formData.email && formData.email.trim()) {
        updateData.email = formData.email;
      }
      if (formData.gender && formData.gender.trim()) {
        updateData.gender = formData.gender;
      }
      if (formData.qualification && formData.qualification.trim()) {
        updateData.qualification = formData.qualification;
      }
      // Only include experience if it's a valid number > 0
      if (formData.experience !== null && formData.experience !== undefined && formData.experience !== '') {
        const exp = parseInt(formData.experience);
        if (!isNaN(exp) && exp >= 0) {
          updateData.experience = exp;
        }
      }
      if (formData.profileSummary && formData.profileSummary.trim()) {
        updateData.profileSummary = formData.profileSummary;
      }
      
      // Location - only include if at least one field is provided
      const hasLocation = formData.houseNo || formData.area || formData.city || formData.state;
      if (hasLocation) {
        updateData.location = {};
        if (formData.houseNo && formData.houseNo.trim()) {
          updateData.location.houseNo = formData.houseNo;
        }
        if (formData.area && formData.area.trim()) {
          updateData.location.area = formData.area;
        }
        if (formData.city && formData.city.trim()) {
          updateData.location.city = formData.city;
        }
        if (formData.state && formData.state.trim()) {
          updateData.location.state = formData.state;
        }
      }
      
      // Include subjects and classes only if they have selections
      // Backend expects 'subjects' and 'classes' (not 'selectedSubjects'/'selectedClasses')
      if (formData.selectedSubjects && formData.selectedSubjects.length > 0) {
        updateData.subjects = formData.selectedSubjects;
      }
      if (formData.selectedClasses && formData.selectedClasses.length > 0) {
        updateData.classes = formData.selectedClasses;
      }

      // Call the onSave prop if provided, otherwise just show success
      if (onSave) {
        onSave(updateData);
      } else {
                showSuccess('Profile updated successfully!');
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } else {
      showError('Please correct the errors in the form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-4 md:my-8 relative max-h-[95vh] flex flex-col">
        {/* Toast Notification */}
        <Toast
          type={toast.type}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={hideToast}
          duration={toast.duration}
        />
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-3 md:py-4 rounded-t-xl z-10 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6 overflow-y-auto flex-1">
          {/* Personal Information */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 md:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 md:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 md:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Professional Information
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.qualification ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., PhD in Mathematics, M.Sc, B.Ed"
                />
                {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter years of experience"
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Summary <span className="text-gray-400 text-xs">(Optional)</span>
                  <span className="text-gray-500 text-xs ml-2">
                    ({formData.profileSummary.length}/500 characters, min 50)
                  </span>
                </label>
                <textarea
                  name="profileSummary"
                  value={formData.profileSummary}
                  onChange={handleChange}
                  rows="4"
                  maxLength="500"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${
                    errors.profileSummary ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Write a compelling summary about your teaching experience, expertise, and achievements..."
                />
                {errors.profileSummary && <p className="text-red-500 text-sm mt-1">{errors.profileSummary}</p>}
              </div>
            </div>
          </div>

          {/* Subjects and Classes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Teaching Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subjects I Teach */}
              <div className="relative" ref={subjectDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subjects I Teach <span className="text-gray-400 text-xs">(Optional)</span>
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
                      {formData.selectedSubjects.map(subjectValue => {
                        const subject = availableSubjects.find(s => s.value === subjectValue);
                        return (
                          <span 
                            key={subjectValue}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                          >
                            {subject?.label}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSubject(subjectValue);
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
                    {availableSubjects.map(subject => {
                      const isSelected = formData.selectedSubjects.includes(subject.value);
                      return (
                        <div
                          key={subject.value}
                          onClick={() => toggleSubjectSelection(subject.value)}
                          className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                            isSelected 
                              ? 'bg-teal-50 text-teal-700 font-medium' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span>{subject.label}</span>
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

              {/* Classes I Teach */}
              <div className="relative" ref={classDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classes I Teach <span className="text-gray-400 text-xs">(Optional)</span>
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
                      {formData.selectedClasses.map(classValue => {
                        const classLevel = availableClasses.find(c => c.value === classValue);
                        return (
                          <span 
                            key={classValue}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {classLevel?.label}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeClass(classValue);
                              }}
                              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
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
                    {availableClasses.map(classLevel => {
                      const isSelected = formData.selectedClasses.includes(classLevel.value);
                      return (
                        <div
                          key={classLevel.value}
                          onClick={() => toggleClassSelection(classLevel.value)}
                          className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                            isSelected 
                              ? 'bg-blue-50 text-blue-700 font-medium' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span>{classLevel.label}</span>
                          {isSelected && (
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
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
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter city"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area/Locality <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.area ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter area/locality"
                />
                {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter state"
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength="6"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="6-digit pincode"
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-4 md:px-6 py-3 md:py-4 rounded-b-xl flex flex-col sm:flex-row justify-end gap-2 md:gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 md:px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-4 md:px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors text-sm md:text-base"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
