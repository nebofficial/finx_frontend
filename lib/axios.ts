import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token Expiry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        // Optional: Call your refresh endpoint
        // const res = await axios.post('http://localhost:5000/api/v1/auth/refresh', { refresh_token: refreshToken });
        // const newToken = res.data.data.token;
        // Cookies.set('auth_token', newToken);
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // return api(originalRequest);
        
        // For MVP: simply clear and redirect to login
        Cookies.remove('auth_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
      } catch (refreshError) {
        Cookies.remove('auth_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
