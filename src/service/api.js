import axios from "axios";

// Employee API (Port 9090)
const api = axios.create({
  baseURL: "http://localhost:9090/api",
});

// Auth API (Port 8081)
const authApi = axios.create({
  baseURL: "http://localhost:8081/api/auth",
});

// Automatically attach JWT token to every request (if available)
const setAuthHeader = (config) => {
  const accessToken = localStorage.getItem("jwtToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

// Automatically handle response errors globally
const handleResponseError = (error) => {
  if (error.response) {
    // Handle 401 Unauthorized errors
    if (error.response.status === 401) {
      console.error("Unauthorized access - redirecting to login.");
      localStorage.removeItem("jwtToken");
      window.location.href = "/"; // Redirect to login page
    }

    // Handle 403 Forbidden errors
    if (error.response.status === 403) {
      console.error("Access forbidden - insufficient permissions.");
      alert("You do not have permission to perform this action.");
    }
  } else if (error.request) {
    console.error("No response received from the server.");
    alert("Network error: Unable to reach the server. Please try again later.");
  } else {
    console.error("Error in request setup:", error.message);
  }

  return Promise.reject(error);
};

// Apply interceptors for authentication
api.interceptors.request.use(setAuthHeader, (error) => Promise.reject(error));
authApi.interceptors.request.use(setAuthHeader, (error) => Promise.reject(error));

// Apply interceptors for handling response errors
api.interceptors.response.use((response) => response, handleResponseError);
authApi.interceptors.response.use((response) => response, handleResponseError);

// Correct exports
export { authApi, api };
