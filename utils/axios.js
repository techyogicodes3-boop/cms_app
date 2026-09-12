import axios from 'axios';
import { clearAuthSession } from './authStorage';

const api = axios.create({
  baseURL: '',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      clearAuthSession();
      window.dispatchEvent(new Event('token-changed'));

      const path = window.location.pathname;
      const isProtectedPath = path === '/admin' || path.startsWith('/admin/') || path === '/account' || path.startsWith('/account/');
      if (isProtectedPath) {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
