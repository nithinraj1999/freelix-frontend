import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshAccessToken } from '../admin/adminServices';
import { adminLogout } from '../../state/slices/adminSlice';
import store from '../../state/store';

const adminInstance = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

const ACCESS_TOKEN_KEY = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;


export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};


adminInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


adminInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log("Attempting to refresh token...");

      if (originalRequest.url.includes('/refresh-token')) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken(); 

        if (!newToken) {
          store.dispatch(adminLogout())
          console.error('Refresh token expired, logging out...');
          localStorage.removeItem('accessToken');
          Cookies.remove('adminRefreshJWT');
          
          window.location.href = '/admin/login';
          return Promise.reject('Refresh token expired');
        }

        console.log("New token retrieved:", newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`; 
        
        return adminInstance(originalRequest); 
      } catch (refreshError) {
        store.dispatch(adminLogout())
        console.error('Failed to refresh token:', refreshError);
        localStorage.removeItem('accessToken');
        Cookies.remove('adminRefreshJWT');
        window.location.href = '/admin/login'; 
        return Promise.reject(refreshError);
      } 
    }
    return Promise.reject(error);
  }
);


export default adminInstance