import axios from 'axios';

// Create axios instance with longer timeout for production
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7777',
  timeout: 30000, // 30 seconds (increased from default 0)
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('Current VITE_API_URL:', import.meta.env.VITE_API_URL);


// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.message);
    } else if (!error.response) {
      console.error('Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
