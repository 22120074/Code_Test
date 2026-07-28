import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      error.message = error.message.charAt(0).toUpperCase() + error.message.slice(1);
    }
    return Promise.reject(error);
  }
);

export default api;
