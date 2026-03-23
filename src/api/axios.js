import axios from 'axios';

// 1. Create a custom Axios instance
const instance = axios.create({
  // In development, it uses localhost. In production, it will use your deployed URL!
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// 2. The Request Interceptor: Automatically attaches the VIP wristband to EVERY request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. The Response Interceptor: Listens for expired tokens (401 errors)
instance.interceptors.response.use(
  (response) => {
    return response; // If everything is good, just pass the data through
  },
  (error) => {
    // If the backend Bouncer says "401 Unauthorized" (token expired or invalid)
    if (error.response && error.response.status === 401) {
      console.error("Session expired. Logging out.");
      localStorage.removeItem('token'); // Shred the dead wristband
      window.location.href = '/login'; // Kick them back to the login screen safely
    }
    return Promise.reject(error);
  }
);

export default instance;