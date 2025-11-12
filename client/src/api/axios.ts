import { useAuthStore } from "@/features/auth/authStore";
import axios, { type AxiosInstance } from "axios";

export const getAuthorizationHeader = async (): Promise<string> => {
  const token = useAuthStore.getState().token;
  return `Bearer ${token}`;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL!,
  headers: {
    "Content-Type": "application/json",
  },
});

// Custom request interceptor that handles encryption
axiosInstance.interceptors.request.use(async (config) => {
  // Add auth header
  const authHeader = await getAuthorizationHeader();
  if (config.headers) {
    config.headers.Authorization = authHeader;
  }

  return config;
});

// Custom response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401 errors (unauthorized)
      try {
        useAuthStore.setState({ isAuthenticated: false });
        window.location.href = "/sign-in";
      } catch (err) {
        console.error(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
