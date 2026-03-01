import { useState, useRef, useEffect } from 'react';
import Toast from '../common/Toast';
import useToast from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import demoService from '../../services/demoService';
import api from '../../services/api';

const BookDemoModal = ({ isOpen, onClose, tutor }) => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    houseNumber: '',
    area: '',
    city: '',
    state: '',
    studentClasses: [],
    subjects: [],
    numberOfStudents: 1,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const timeDropdownRef = useRef(null);
  const classDropdownRef = useRef(null);
  const subjectDropdownRef = useRef(null);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  // Fetch class levels and subjects on component mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [classesRes, subjectsRes] = await Promise.all([
          api.get('/master-data/classes'),
          api.get('/master-data/subjects')
        ]);
        setAvailableClasses(classesRes.data || []);
        setAvailableSubjects(subjectsRes.data || []);
      } catch (error) {
        console.error('Error fetching master data:', error);
        // Set fallback values if API fails
        setAvailableClasses(['CLASS_1', 'CLASS_2', 'CLASS_3', 'CLASS_4', 'CLASS_5', 
                             'CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 
                             'CLASS_11', 'CLASS_12']);
        setAvailableSubjects(['MATHEMATICS', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 
                              'ENGLISH', 'HINDI', 'SOCIAL_SCIENCE']);
      }
    };
    fetchMasterData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setIsTimeDropdownOpen(false);
      }
      if (classDropdownRef.current && !classDropdownRef.current.contains(event.target)) {
        setIsClassDropdownOpen(false);
      }
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target)) {
        setIsSubjectDropdownOpen(false);
      }
    };

    if (isTimeDropdownOpen || isClassDropdownOpen || isSubjectDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTimeDropdownOpen, isClassDropdownOpen, isSubjectDropdownOpen]);

  const handleTimeSelect = (time) => {
    setFormData((prev) => ({
      ...prev,
      time: time,
    }));
    if (errors.time) {
      setErrors((prev) => ({ ...prev, time: '' }));
    }
    setIsTimeDropdownOpen(false);
  };

  const handleClassToggle = (classLevel) => {
    setFormData((prev) => {
      const isSelected = prev.studentClasses.includes(classLevel);
      return {
        ...prev,
        studentClasses: isSelected
          ? prev.studentClasses.filter(c => c !== classLevel)
          : [...prev.studentClasses, classLevel]
      };
    });
    if (errors.studentClasses) {
      setErrors((prev) => ({ ...prev, studentClasses: '' }));
    }
  };

  const handleSubjectToggle = (subject) => {
    setFormData((prev) => {
      const isSelected = prev.subjects.includes(subject);
      return {
        ...prev,
        subjects: isSelected
          ? prev.subjects.filter(s => s !== subject)
          : [...prev.subjects, subject]
      };
    });
    if (errors.subjects) {
      setErrors((prev) => ({ ...prev, subjects: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check authentication
    if (!isAuthenticated()) {
      showError('Please login to book a demo session');
      return;
    }

    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    if (!formData.time) {
      newErrors.time = 'Please select a time slot';
    }
    if (!formData.studentClasses || formData.studentClasses.length === 0) {
      newErrors.studentClasses = 'Please select at least one class';
    }
    if (!formData.subjects || formData.subjects.length === 0) {
      newErrors.subjects = 'Please select at least one subject';
    }
    if (!formData.numberOfStudents || formData.numberOfStudents < 1) {
      newErrors.numberOfStudents = 'Please provide number of students';
    }
    if (!formData.houseNumber || formData.houseNumber.trim().length < 2) {
      newErrors.houseNumber = 'Please provide house number';
    }
    if (!formData.area || formData.area.trim().length < 3) {
      newErrors.area = 'Please provide area name';
    }
    if (!formData.city || formData.city.trim().length < 2) {
      newErrors.city = 'Please provide city name';
    }
    if (!formData.state || formData.state.trim().length < 2) {
      newErrors.state = 'Please provide state name';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Convert time to 24-hour format
      const timeIn24Hour = convertTo24Hour(formData.time);
      
      // Calculate end time (1 hour after start time)
      const [hours, minutes] = timeIn24Hour.split(':');
      const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
      const endTime = `${endHour}:${minutes}`;

      const result = await demoService.createDemo({
        tutorId: tutor.id,
        date: formData.date,              // LocalDate format: "2026-02-25"
        from: timeIn24Hour,               // LocalTime format: "17:00"
        to: endTime,                      // LocalTime format: "18:00"
        houseNumber: formData.houseNumber.trim(),
        area: formData.area.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        studentClasses: formData.studentClasses,  // Array of class strings
        subjects: formData.subjects,              // Array of subject strings
        numberOfStudents: parseInt(formData.numberOfStudents, 10),  // Integer
      });

      
      // If we get a result with demoId, it's successful
      // (interceptor extracts the inner data object, not the ApiResponse wrapper)
      if (result && result.demoId) {
        showSuccess(`Demo session booked successfully with ${tutor.name}!`);
        setTimeout(() => {
          onClose();
          setFormData({ 
            date: '', 
            time: '', 
            houseNumber: '', 
            area: '', 
            city: '', 
            state: '',
            studentClasses: [],
            subjects: [],
            numberOfStudents: 1
          });
          setErrors({});
        }, 1500);
      } else {
        showError(result?.message || 'Failed to book demo session');
      }
    } catch (error) {
            showError('Failed to book demo session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert 12-hour time to 24-hour format
  const convertTo24Hour = (time12h) => {
    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (period === 'PM' && hours !== '12') {
      hours = String(parseInt(hours) + 12);
    } else if (period === 'AM' && hours === '12') {
      hours = '00';
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  if (!isOpen || !tutor) return null;

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Demo Session</h2>
            <p className="text-gray-600">Schedule a demo class with {tutor.name}</p>
          </div>

          {/* Tutor Info Card */}
          <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl p-4 mb-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white">
              <img
                src={tutor.image}
                alt={tutor.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 items-center justify-center text-white text-2xl font-bold hidden">
                {tutor.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{tutor.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">{tutor.rating}</span>
                </div>
                <span className="text-sm text-gray-600">• {tutor.experience} years exp</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Session Fee</p>
              <p className="text-xl font-bold text-teal-600">Free</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Date and Time Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.date ? 'border-red-400' : 'border-gray-200'
                    }`}
                    onFocus={(e) => !errors.date && (e.target.style.borderColor = '#14b8a6')}
                    onBlur={(e) => !errors.date && (e.target.style.borderColor = '#cbd5e1')}
                    required
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.date}</p>
                )}
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Time <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={timeDropdownRef}>
                  {/* Custom Dropdown Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsTimeDropdownOpen(!isTimeDropdownOpen);
                      setIsClassDropdownOpen(false);
                      setIsSubjectDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:outline-none transition-colors appearance-none bg-white cursor-pointer font-medium text-left ${
                      formData.time ? 'text-gray-900' : 'text-gray-400'
                    } ${
                      errors.time ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'
                    } ${isTimeDropdownOpen ? 'border-teal-500 ring-2 ring-teal-100' : ''}`}
                  >
                    {formData.time || 'Choose time slot'}
                  </button>
                  
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg 
                      className={`w-5 h-5 transition-all ${
                        errors.time ? 'text-red-400' : 'text-gray-400'
                      } ${isTimeDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Custom Dropdown Menu */}
                  {isTimeDropdownOpen && (
                    <div className="absolute z-[60] w-full mt-2 bg-white border-2 border-teal-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto animate-slideDown">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleTimeSelect(slot)}
                          className={`w-full px-4 py-3 text-left transition-colors hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 ${
                            formData.time === slot 
                              ? 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 font-semibold' 
                              : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{slot}</span>
                            {formData.time === slot && (
                              <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.time && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.time}</p>
                )}
              </div>
            </div>

            {/* Student Details Section */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Student Details</h3>
              
              {/* Student Class (Multi-Select) */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Student Class <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={classDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsClassDropdownOpen(!isClassDropdownOpen);
                      setIsTimeDropdownOpen(false);
                      setIsSubjectDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:outline-none transition-colors bg-white cursor-pointer text-left ${
                      formData.studentClasses.length > 0 ? 'text-gray-900' : 'text-gray-400'
                    } ${
                      errors.studentClasses ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } ${isClassDropdownOpen ? 'border-purple-500 ring-2 ring-purple-100' : ''}`}
                  >
                    <span className="block truncate">
                      {formData.studentClasses.length > 0 
                        ? formData.studentClasses.map(c => c.replace('CLASS_', 'Class ')).join(', ')
                        : 'Select class(es)'}
                    </span>
                  </button>
                  
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg 
                      className={`w-5 h-5 transition-all ${
                        errors.studentClasses ? 'text-red-400' : 'text-gray-400'
                      } ${isClassDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {isClassDropdownOpen && (
                    <div className="absolute z-[60] w-full mt-2 bg-white border-2 border-purple-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                      {availableClasses.filter(c => c !== 'ALL').map((classLevel) => (
                        <button
                          key={classLevel}
                          type="button"
                          onClick={() => handleClassToggle(classLevel)}
                          className={`w-full px-4 py-3 text-left transition-colors hover:bg-purple-50 ${
                            formData.studentClasses.includes(classLevel)
                              ? 'bg-purple-50 text-purple-700 font-semibold' 
                              : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{classLevel.replace('CLASS_', 'Class ')}</span>
                            {formData.studentClasses.includes(classLevel) && (
                              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.studentClasses && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.studentClasses}</p>
                )}
              </div>

              {/* Subjects (Multi-Select) */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Subjects <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={subjectDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
                      setIsTimeDropdownOpen(false);
                      setIsClassDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:outline-none transition-colors bg-white cursor-pointer text-left ${
                      formData.subjects.length > 0 ? 'text-gray-900' : 'text-gray-400'
                    } ${
                      errors.subjects ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } ${isSubjectDropdownOpen ? 'border-purple-500 ring-2 ring-purple-100' : ''}`}
                  >
                    <span className="block truncate">
                      {formData.subjects.length > 0 
                        ? formData.subjects.map(s => s.replace(/_/g, ' ')).join(', ')
                        : 'Select subject(s)'}
                    </span>
                  </button>
                  
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg 
                      className={`w-5 h-5 transition-all ${
                        errors.subjects ? 'text-red-400' : 'text-gray-400'
                      } ${isSubjectDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {isSubjectDropdownOpen && (
                    <div className="absolute z-[60] w-full mt-2 bg-white border-2 border-purple-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                      {availableSubjects.filter(s => s !== 'ALL').map((subject) => (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => handleSubjectToggle(subject)}
                          className={`w-full px-4 py-3 text-left transition-colors hover:bg-purple-50 ${
                            formData.subjects.includes(subject)
                              ? 'bg-purple-50 text-purple-700 font-semibold' 
                              : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{subject.replace(/_/g, ' ')}</span>
                            {formData.subjects.includes(subject) && (
                              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.subjects && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.subjects}</p>
                )}
              </div>

              {/* Number of Students */}
              <div>
                <label htmlFor="numberOfStudents" className="block text-sm font-semibold text-gray-900 mb-2">
                  Number of Students <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="numberOfStudents"
                  name="numberOfStudents"
                  value={formData.numberOfStudents}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.numberOfStudents ? 'border-red-400' : 'border-gray-200'
                  }`}
                  onFocus={(e) => !errors.numberOfStudents && (e.target.style.borderColor = '#9333ea')}
                  onBlur={(e) => !errors.numberOfStudents && (e.target.style.borderColor = '#cbd5e1')}
                  required
                />
                {errors.numberOfStudents && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.numberOfStudents}</p>
                )}
              </div>
            </div>

            {/* Address Fields Breakdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Your Address <span className="text-red-500">*</span>
              </label>
              
              {/* House Number */}
              <div className="mb-4">
                <input
                  type="text"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleChange}
                  placeholder="House/Flat Number, Building Name"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.houseNumber ? 'border-red-400' : 'border-gray-200'
                  }`}
                  onFocus={(e) => !errors.houseNumber && (e.target.style.borderColor = '#14b8a6')}
                  onBlur={(e) => !errors.houseNumber && (e.target.style.borderColor = '#cbd5e1')}
                  required
                />
                {errors.houseNumber && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.houseNumber}</p>
                )}
              </div>

              {/* Area */}
              <div className="mb-4">
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Area, Locality"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.area ? 'border-red-400' : 'border-gray-200'
                  }`}
                  onFocus={(e) => !errors.area && (e.target.style.borderColor = '#14b8a6')}
                  onBlur={(e) => !errors.area && (e.target.style.borderColor = '#cbd5e1')}
                  required
                />
                {errors.area && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.area}</p>
                )}
              </div>

              {/* City and State Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.city ? 'border-red-400' : 'border-gray-200'
                    }`}
                    onFocus={(e) => !errors.city && (e.target.style.borderColor = '#14b8a6')}
                    onBlur={(e) => !errors.city && (e.target.style.borderColor = '#cbd5e1')}
                    required
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.city}</p>
                  )}
                </div>

                {/* State */}
                <div>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.state ? 'border-red-400' : 'border-gray-200'
                    }`}
                    onFocus={(e) => !errors.state && (e.target.style.borderColor = '#14b8a6')}
                    onBlur={(e) => !errors.state && (e.target.style.borderColor = '#cbd5e1')}
                    required
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.state}</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2 ml-1">
                ℹ️ Only Area, City, and State will be shared with the tutor. Your house number remains private until booking confirmation.
              </p>
            </div>

            {/* Important Note */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Important Information</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Demo session is completely free</li>
                    <li>• Session duration: 45-60 minutes</li>
                    <li>• You'll receive confirmation via SMS/Email</li>
                    <li>• Cancel anytime before 2 hours of session</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ backgroundColor: '#14b8a6' }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0d9488')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#14b8a6')}
            >
              {loading ? 'Booking Demo...' : 'Book Demo Session'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        /* Custom select styling */
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        /* Better mobile experience for select dropdown */
        @media (max-width: 768px) {
          select {
            font-size: 16px; /* Prevents zoom on iOS */
          }
          
          select option {
            padding: 12px 16px;
            font-size: 16px;
          }
        }

        /* Focus styles for better accessibility */
        select:focus {
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
        }

        /* Hover effect for select */
        select:hover:not(:disabled) {
          border-color: #14b8a6 !important;
        }

        /* Custom scrollbar for time dropdown */
        .max-h-64::-webkit-scrollbar {
          width: 8px;
        }

        .max-h-64::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .max-h-64::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #14b8a6, #06b6d4);
          border-radius: 10px;
        }

        .max-h-64::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0d9488, #0891b2);
        }

        /* Smooth scrolling for modal content */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #14b8a6 #f1f5f9;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #14b8a6;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #0d9488;
        }
      `}</style>

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

export default BookDemoModal;
