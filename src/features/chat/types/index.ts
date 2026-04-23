/**
 * Chat Feature - Types
 */

export interface ChatMessage {
  id?: string;
  text: string;
  role: "user" | "assistant";
  timestamp?: string;
}

// API Response Types
export interface ApiSuccessResponse {
  status: "success";
  statusCode: 200;
  message: string;
  data: {
    reply: string;
  };
  timestamp: string;
}

export interface ApiErrorResponse {
  status: "error";
  statusCode: 400 | 401 | 403 | 500;
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export interface ChatResponse {
  reply: string;
  id?: string;
  timestamp?: string;
}

// Error handling interface
export interface ChatError {
  code: string;
  message: string;
  statusCode: number;
  isUserError: boolean; // true for 400/403, false for 401/500
}
