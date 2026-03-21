import axios from "axios";

/**
 * Use environment variable in production.
 * Fallback to localhost in development.
 */
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:10000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * 🔥 ADD AUTH TOKEN TO EVERY REQUEST
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Optional: Centralized error logging
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error("API ERROR:", error.response || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;