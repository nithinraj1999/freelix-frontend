import axios from 'axios';
import store from '../../state/store';
import { refreshAccessToken } from '../user/userServices';
import { userLogout } from '../../state/slices/userSlice';
import Cookies from 'js-cookie';


const userInstance = axios.create({
  baseURL: import.meta.env.VITE_CLIENT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const ACCESS_TOKEN_KEY = import.meta.env.VITE_CLIENT_ACCESS_TOKEN;

export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = () => {
  return localStorage.getItem("userAccessToken");
};


userInstance.interceptors.request.use(
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


userInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log("Attempting to refresh token...");

      // Bypass the interceptor for refresh token request
      if (originalRequest.url.includes('/refresh-token')) {
        return Promise.reject(error);
      }
      originalRequest._retry = true; 
      try {
        const newToken = await refreshAccessToken(); 

        if (!newToken) {
          store.dispatch(userLogout())
          console.error('Refresh token expired, logging out...');
          localStorage.removeItem('userAccessToken');
          Cookies.remove('adminRefreshJWT');
          
          window.location.href = '/login';
          return Promise.reject('Refresh token expired');
        }

        console.log("New token retrieved:", newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`; 
        
        return userInstance(originalRequest); 
      } catch (refreshError) {
        store.dispatch(userLogout())
        console.error('Failed to refresh token:', refreshError);
        localStorage.removeItem('userAccessToken');
        Cookies.remove('userRefreshJWT');
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      } 
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default userInstance;
