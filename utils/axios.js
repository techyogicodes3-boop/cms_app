import axios from 'axios';
import { clearAuthSession } from './authStorage';
import { clearCartStorage } from '../services/cart.service';

const api = axios.create({
  baseURL: '',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      clearAuthSession();
      clearCartStorage();
      window.dispatchEvent(new Event('token-changed'));

      if (!['/', '/login'].includes(window.location.pathname)) {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
