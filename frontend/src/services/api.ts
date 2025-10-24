import axios, { AxiosInstance, AxiosError } from 'axios';
import { auth } from './firebase';

const baseURL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api';

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 180_000, // Increased timeout for potentially long AI generations
});

// Request interceptor to add Firebase ID token to headers
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));


// Response interceptor to handle basic errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // If a 401 error occurs, Firebase's onAuthStateChanged listener in AuthContext
    // will handle the user state change. We simply reject the promise here.
    if (error.response?.status === 401) {
        console.error("Authentication error. The user may need to log in again.");
    }
    return Promise.reject(error);
  }
);

export default api;
