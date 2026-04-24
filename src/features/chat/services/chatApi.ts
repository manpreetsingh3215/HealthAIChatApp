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
  return new Promise((resolve, reject) => {
    try {
      const baseURL =
        process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
      const xhr = new XMLHttpRequest();
      let fullText = "";
      let processedLength = 0;
      let buffer = "";
      let streamDone = false;

      const processSSEData = (raw: string) => {
        buffer += raw;
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith("data: ")) continue;

          const data = trimmedLine.slice(6).trim();
          if (!data) continue;

          if (data === "[DONE]") {
            streamDone = true;
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.chunk) {
              const chunk = String(parsed.chunk);
              fullText += chunk;
              onChunk?.(chunk);
            }
          } catch (e) {
            console.error("Failed to parse chunk:", data, e);
          }
        }
      };

      xhr.open("POST", `${baseURL}${url}`);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onprogress = () => {
        const responseChunk = xhr.responseText.slice(processedLength);
        processedLength = xhr.responseText.length;
        if (!responseChunk) return;
        processSSEData(responseChunk);
      };

      xhr.onerror = () => {
        reject(new Error("Network request failed"));
      };

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          let errorData;
          try {
            errorData = xhr.responseText ? JSON.parse(xhr.responseText) : undefined;
          } catch (parseErr) {
            console.error("Failed to parse error response:", parseErr);
          }

          const error = new Error(`HTTP error! status: ${xhr.status}`);
          (error as any).response = {
            status: xhr.status,
            data: errorData,
            statusText: xhr.statusText,
          };
          reject(error);
          return;
        }

        const remaining = xhr.responseText.slice(processedLength);
        if (remaining) {
          processSSEData(remaining);
          processedLength = xhr.responseText.length;
        }

        if (buffer.trim()) {
          processSSEData("\n");
        }

        resolve({
          reply: fullText || (streamDone ? "" : "No response received"),
          timestamp: new Date().toISOString(),
        });
      };

      xhr.send(JSON.stringify({ message }));
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
