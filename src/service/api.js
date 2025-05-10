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

// Apply interceptors for authentication
api.interceptors.request.use(setAuthHeader, (error) => Promise.reject(error));
authApi.interceptors.request.use(setAuthHeader, (error) => Promise.reject(error));

// Correct exports
export { authApi, api };
