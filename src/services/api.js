import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log('🔄 [INTERCEPTOR] Processing response');
    console.log('Original response.data:', response.data);
    console.log('Has data property?', 'data' in (response.data || {}));
    console.log('Has success property?', 'success' in (response.data || {}));
    
    // Extract data from ApiResponse wrapper if present
    // Backend returns: { success: true, data: [...], message: "..." }
    // We extract data but keep success and message fields for services that need them
    if (response.data?.data !== undefined && response.data?.success !== undefined) {
      console.log('✅ [INTERCEPTOR] ApiResponse wrapper detected - extracting data');
      console.log('Extracted data:', response.data.data);
      console.log('Success:', response.data.success);
      console.log('Message:', response.data.message);
      
      const processedResponse = {
        ...response,
        data: response.data.data,
        message: response.data.message,
        success: response.data.success,
        apiResponse: response.data, // Keep original wrapper for services that need it
      };
      
      console.log('📦 [INTERCEPTOR] Processed response:', processedResponse);
      console.log('Processed response.data:', processedResponse.data);
      console.log('Processed response.success:', processedResponse.success);
      
      return processedResponse;
    }
    
    console.log('⚠️ [INTERCEPTOR] No ApiResponse wrapper - returning as-is');
    return response;
  },
  (error) => {
    console.error('❌ [INTERCEPTOR ERROR]', error);
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
            
      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/';
      }

      // Extract error message from response
      // Backend sends: { timestamp, status, error, message, path }
      const errorMessage = data?.message || data?.error || error.message || 'An error occurred';
            
      // Create a proper error object with the message
      const customError = new Error(errorMessage);
      customError.response = error.response;
      customError.status = status;
      
      return Promise.reject(customError);
    } else if (error.request) {
      const customError = new Error('No response from server. Please check your connection.');
      customError.request = error.request;
      return Promise.reject(customError);
    }

    return Promise.reject(error);
  }
);

export default api;
