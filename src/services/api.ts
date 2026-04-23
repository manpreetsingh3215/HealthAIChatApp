/**
 * Main API Client Configuration
 */

import axios, { AxiosInstance } from "axios";
import {
  errorInterceptor,
  requestInterceptor,
  responseInterceptor,
} from "./interceptors";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Create and configure axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Apply interceptors
 */
apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export { apiClient };
export default apiClient;
