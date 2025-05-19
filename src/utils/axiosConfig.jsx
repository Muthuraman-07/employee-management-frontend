import axios from 'axios';

// Create an Axios instance with a base URL
const instance = axios.create({
  baseURL: 'http://localhost:8081', // Replace with your backend URL
});

/**
 * Interceptor to attach the JWT token to every request (if available).
 */
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor to handle response errors globally.
 */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        console.error('Unauthorized access - redirecting to login.');
        localStorage.removeItem('token');
        window.location.href = '/'; // Redirect to login page
      }

      // Handle 403 Forbidden errors
      if (error.response.status === 403) {
        console.error('Access forbidden - insufficient permissions.');
        alert('You do not have permission to perform this action.');
      }
    } else if (error.request) {
      console.error('No response received from the server.');
      alert('Network error: Unable to reach the server. Please try again later.');
    } else {
      console.error('Error in request setup:', error.message);
    }

    return Promise.reject(error);
  }
);

export default instance;
