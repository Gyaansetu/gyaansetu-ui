import { useState, useEffect } from 'react';
import Toast from '../common/Toast';
import useToast from '../../hooks/useToast';

const EditParentProfileModal = ({ isOpen, onClose, parentData, onSave }) => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    houseNo: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});

  // Update form data when parentData changes
  useEffect(() => {
    if (parentData && isOpen) {
      setFormData({
        name: parentData.name || '',
        email: parentData.email || '',
        phone: parentData.phone || '',
        houseNo: parentData.houseNo || '',
        area: parentData.area || '',
        city: parentData.city || '',
        state: parentData.state || '',
        pincode: parentData.pincode || '',
      });
      setErrors({});
    }
  }, [parentData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation (only if provided)
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    // Phone validation (only if provided)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Phone must be 10 digits';
      }
    }

    // Pincode validation (only if provided)
    if (formData.pincode && formData.pincode.trim()) {
      const pincodeRegex = /^[0-9]{6}$/;
      if (!pincodeRegex.test(formData.pincode)) {
        newErrors.pincode = 'Pincode must be 6 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Only include fields that have values
      const updateData = {};
      
      if (formData.name && formData.name.trim()) {
        updateData.name = formData.name.trim();
      }
      if (formData.email && formData.email.trim()) {
        updateData.email = formData.email.trim();
      }
      if (formData.phone && formData.phone.trim()) {
        updateData.phone = formData.phone.replace(/\s/g, '');
      }
      if (formData.houseNo && formData.houseNo.trim()) {
        updateData.houseNo = formData.houseNo.trim();
      }
      if (formData.area && formData.area.trim()) {
        updateData.area = formData.area.trim();
      }
      if (formData.city && formData.city.trim()) {
        updateData.city = formData.city.trim();
      }
      if (formData.state && formData.state.trim()) {
        updateData.state = formData.state.trim();
      }
      if (formData.pincode && formData.pincode.trim()) {
        updateData.pincode = formData.pincode.trim();
      }

      // Call the onSave prop if provided
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
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-4 md:my-8 relative max-h-[95vh] flex flex-col">
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
            <div className="space-y-3 md:space-y-4">
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
                  placeholder="your.email@example.com"
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
                  maxLength="10"
                  className={`w-full px-3 md:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="9876543210"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                <p className="text-xs text-gray-500 mt-1">10-digit mobile number without country code</p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location Details
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  House No / Flat (Optional)
                </label>
                <input
                  type="text"
                  name="houseNo"
                  value={formData.houseNo}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Enter house number or flat"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Area / Locality (Optional)
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Enter area or locality"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    City (Optional)
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    State (Optional)
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base"
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Pincode (Optional)
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength="6"
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base"
                  placeholder="6-digit pincode"
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
            <div className="flex items-start">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 mr-2 md:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-xs md:text-sm font-medium text-blue-800">Profile Update Note</h4>
                <p className="text-xs text-blue-700 mt-1">
                  Your contact information and location details will be updated across the platform. Make sure your phone number and email are correct for receiving important notifications.
                </p>
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

export default EditParentProfileModal;
