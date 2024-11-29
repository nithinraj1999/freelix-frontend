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

// Function to retrieve access token from local storage
export const getAccessToken = () => {
  return localStorage.getItem("userAccessToken");
};


userInstance.interceptors.request.use(
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


userInstance.interceptors.response.use(
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
          store.dispatch(userLogout())
          console.error('Refresh token expired, logging out...');
          localStorage.removeItem('userAccessToken');
          Cookies.remove('adminRefreshJWT');
          
          window.location.href = '/login';
          return Promise.reject('Refresh token expired');
        }

        console.log("New token retrieved:", newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`; // Set new token in request header
        
        return userInstance(originalRequest); // Retry the original request
      } catch (refreshError) {
        store.dispatch(userLogout())
        console.error('Failed to refresh token:', refreshError);
        localStorage.removeItem('userAccessToken');
        Cookies.remove('userRefreshJWT');
        window.location.href = '/login'; // Redirect to login page
        return Promise.reject(refreshError);
      } 
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default userInstance;
