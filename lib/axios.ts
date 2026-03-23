import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Browser: prefer same-origin `/api/v1` (proxied by Next → backend).
 * Server (SSR): call backend directly via BACKEND_URL.
 * Override anytime with NEXT_PUBLIC_API_URL (full URL like http://127.0.0.1:5000/api/v1).
 */
function getApiBaseURL(): string {
  const explicit = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (explicit) {
    const e = explicit.replace(/\/$/, '');
    if (e.startsWith('http')) return e;
    // Relative path e.g. /api/v1 — only valid in the browser
    if (typeof window !== 'undefined') return e;
  }
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  const b = process.env.BACKEND_URL || 'http://127.0.0.1:5000';
  return `${b.replace(/\/$/, '')}/api/v1`;
}

const api = axios.create({
  baseURL: getApiBaseURL(),
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
    if (config.data instanceof FormData) {
      delete (config.headers as Record<string, unknown>)['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry transient 429 rate-limit errors for idempotent GET requests.
    if (error.response?.status === 429 && originalRequest?.method === 'get') {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      if (originalRequest._retryCount <= 2) {
        const waitMs = originalRequest._retryCount * 500;
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        return api(originalRequest);
      }
    }

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
