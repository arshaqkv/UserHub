import axios from 'axios';

// Create a custom axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',  // Change to your backend API URL
  withCredentials: true,  // Ensures cookies (including JWT) are sent with each request
});

export default axiosInstance;
