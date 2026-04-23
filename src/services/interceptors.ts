/**
 * API Request/Response Interceptors
 */

import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "./types";

/**
 * Request interceptor - add auth headers, logging, etc.
 */
export const requestInterceptor = (config: any) => {
  // Add request logging
  console.log("[API] Request:", {
    method: config.method,
    url: config.url,
    data: config.data,
  });

  // Add auth token if available (future implementation)
  // const token = await getAuthToken();
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  config.headers["Content-Type"] = "application/json";
  return config;
};

/**
 * Response interceptor - handle success, errors, refresh tokens, etc.
 */
export const responseInterceptor = (response: AxiosResponse) => {
  console.log("[API] Response:", {
    status: response.status,
    url: response.config.url,
  });

  return response.data;
};

/**
 * Error interceptor - handle API errors globally
 */
export const errorInterceptor = (error: AxiosError): Promise<ApiError> => {
  const apiError: ApiError = {
    status: error.response?.status || 500,
    message: error.message,
    code: error.code,
  };

  console.error("[API] Error:", apiError);

  // Handle specific error codes
  if (error.response?.status === 401) {
    // Handle unauthorized - refresh token or logout
    console.log("[API] Unauthorized - handle token refresh");
  }

  if (error.response?.status === 429) {
    // Handle rate limiting
    console.log("[API] Rate limited - retry after delay");
  }

  return Promise.reject(apiError);
};
