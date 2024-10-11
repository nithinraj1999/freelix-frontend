import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshAccessToken } from '../admin/adminServices';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../../state/slices/adminSlice';
import store from '../../state/store';

const adminInstance = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

const ACCESS_TOKEN_KEY = 'accessToken';


export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

// Function to retrieve access token from local storage
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};


adminInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach the access token to the Authorization header
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

    // Check if the error is a 401 and the request hasn't been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log("Attempting to refresh token...");

      // Bypass the interceptor for refresh token request
      if (originalRequest.url.includes('/refresh-token')) {
        return Promise.reject(error);
      }
      originalRequest._retry = true; // Mark the request as retried
      try {
        const newToken = await refreshAccessToken(); // Try refreshing the token

        if (!newToken) {
          store.dispatch(adminLogout())
          console.error('Refresh token expired, logging out...');
          localStorage.removeItem('accessToken');
          Cookies.remove('adminRefreshJWT');
          
          window.location.href = '/admin/login';
          return Promise.reject('Refresh token expired');
        }

        console.log("New token retrieved:", newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`; // Set new token in request header
        
        return adminInstance(originalRequest); // Retry the original request
      } catch (refreshError) {
        store.dispatch(adminLogout())
        console.error('Failed to refresh token:', refreshError);
        localStorage.removeItem('accessToken');
        Cookies.remove('adminRefreshJWT');
        

        window.location.href = '/admin/login'; // Redirect to login page
        return Promise.reject(refreshError);
      } 
    }

    // Handle other errors
    return Promise.reject(error);
  }
);


export default adminInstance