import axios from 'axios';
// in app
const API_AUTH_URL = 'http://localhost:8081/api/auth'; 

// Example: POST request to create a user


// Example: POST request to authenticate user
export const authenticate = async (user) => {
  try {
    const response = await axios.post(`${API_AUTH_URL}/login`, user);
    return response.data;
  } catch (error) {
    throw error;
  }
};
