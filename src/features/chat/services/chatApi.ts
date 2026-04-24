/**
 * Chat Feature - API Service
 */

import { apiClient } from "@/services/api";
import { ChatMessage, ChatResponse } from "../types";

/**
 * Parse SSE (Server-Sent Events) stream
 * Streams chunks in real-time with callback
 * Compatible with React Native
 */
const parseSSEStream = async (
  url: string,
  message: string,
  onChunk?: (chunk: string) => void,
): Promise<ChatResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseURL =
        process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

      const response = await fetch(`${baseURL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      console.log("API response status:", response);

      if (!response.ok) {
        let errorData;
        try {
          // Parse error response body to get detailed error information
          errorData = await response.json();
          console.log("API error response data:", errorData);
        } catch (parseErr) {
          // If JSON parsing fails, errorData will be undefined
          console.error("Failed to parse error response:", parseErr);
        }

        // Create error with attached response
        const error = new Error(`HTTP error! status: ${response.status}`);
        (error as any).response = {
          status: response.status,
          data: errorData,
          statusText: response.statusText,
        };
        console.log("API error response data:", error);
        throw error;
      }

      // For React Native, use text() method instead of getReader()
      const text = await response.text();
      console.log("Raw response:", text);

      let fullText = "";
      const lines = text.split("\n");

      // Process each line with a small delay to ensure UI updates
      for (const line of lines) {
        console.log("Processing line:", line);

        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim(); // Remove "data: " prefix

          if (data === "[DONE]") {
            // Stream finished
            console.log("Stream completed");
            break;
          }

          if (data) {
            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk) {
                fullText += parsed.chunk;
                console.log(
                  "Stream chunk:",
                  parsed.chunk,
                  "Full text so far:",
                  fullText,
                );

                // Call the callback with each chunk for real-time display
                if (onChunk) {
                  // Use setTimeout to batch state updates and ensure UI renders
                  setTimeout(() => {
                    onChunk(parsed.chunk);
                  }, 0);
                }
              }
            } catch (e) {
              // Skip invalid JSON
              console.error("Failed to parse chunk:", data, e);
            }
          }
        }
      }

      console.log("Final full text:", fullText);

      resolve({
        reply: fullText || "No response received",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("SSE Parse Error:", error);
      reject(error);
    }
  });
};

export const chatService = {
  /**
   * Send a text message and get AI response using streaming endpoint
   * Handles Server-Sent Events (SSE) format with real-time chunks
   */
  sendMessage: async (
    message: string,
    onChunk?: (chunk: string) => void,
  ): Promise<ChatResponse> => {
    try {
      return await parseSSEStream("/ai/chat-stream", message, onChunk);
    } catch (error: any) {
      console.error("Chat API Error:", error);
      throw error;
    }
  },

  /**
   * Get chat history
   */
  getHistory: (): Promise<ChatMessage[]> => {
    return apiClient.get("/chat/history");
  },

  /**
   * Clear chat history
   */
  clearHistory: (): Promise<void> => {
    return apiClient.delete("/chat/history");
  },
};
