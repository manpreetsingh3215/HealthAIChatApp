/**
 * useChat Hook
 * Custom hook for managing chat state and logic with real-time streaming
 */

import { useCallback, useState } from "react";
import { chatService } from "../services/chatApi";
import { ChatMessage } from "../types";

export interface ChatError {
  message: string;
  details?: string;
  statusCode?: number;
}

/**
 * Parse error from various formats into ChatError object
 */
const parseError = (err: any): ChatError => {
  if (!err) {
    return { message: "An unknown error occurred" };
  }

  // Handle HTTP/Axios errors with response
  if (err.response) {
    const data = err.response.data;

    // Handle nested error object structure: { error: { message: "...", code: "..." } }
    if (data?.error?.message) {
      return {
        message: data.error.message,
        details: data.error.code || data.details || err.response.statusText,
        statusCode: data.statusCode || err.response.status,
      };
    }

    // Handle flat error structure: { message: "...", details: "..." }
    return {
      message: data?.message || err.message || "API Error",
      details: data?.details || data?.code || err.response.statusText,
      statusCode: data?.statusCode || err.response.status,
    };
  }

  // Handle network errors
  if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
    return {
      message: "Connection timeout",
      details: "Request took too long. Please check your internet connection.",
    };
  }

  if (err.message?.includes("Network") || err.code === "ENOTFOUND") {
    return {
      message: "Network error",
      details: "Unable to connect. Please check your internet connection.",
    };
  }

  // Handle custom error messages
  if (typeof err === "string") {
    return { message: err };
  }

  // Handle error objects with message property
  if (err.message) {
    return {
      message: err.message,
      details: err.details || err.statusText,
      statusCode: err.statusCode || err.status,
    };
  }

  // Fallback
  return { message: "An error occurred. Please try again." };
};

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);

  /**
   * Load chat history
   */
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const history = await chatService.getHistory();
      setMessages(history);
    } catch (err: any) {
      const errorObj = parseError(err);
      setError(errorObj);
      console.error("Error loading history:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Send message and get response with real-time streaming
   * Only shows AI message box when first chunk arrives
   */
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input immediately after sending
    setError(null);

    try {
      setLoading(true);

      // AI message ID for tracking, but don't add empty message
      const aiMessageId = (Date.now() + 1).toString();
      let aiMessageAdded = false; // Track if AI message has been added

      // Handle real-time chunks with immediate state updates
      const onChunk = (chunk: string) => {
        console.log("Chunk received in hook:", chunk);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const aiMsgIndex = updatedMessages.findIndex(
            (m) => m.id === aiMessageId,
          );

          if (aiMsgIndex !== -1) {
            // AI message exists, append chunk
            updatedMessages[aiMsgIndex] = {
              ...updatedMessages[aiMsgIndex],
              text: updatedMessages[aiMsgIndex].text + chunk,
            };
          } else if (!aiMessageAdded) {
            // First chunk - create AI message with content
            const aiMessage: ChatMessage = {
              id: aiMessageId,
              text: chunk,
              role: "assistant",
              timestamp: new Date().toISOString(),
            };
            updatedMessages.push(aiMessage);
            aiMessageAdded = true;
          }

          return updatedMessages;
        });
      };

      // Send message with streaming callback
      const response = await chatService.sendMessage(text, onChunk);

      // Update message with final response (in case chunks were missed)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: response.reply,
                timestamp: response.timestamp,
              }
            : msg,
        ),
      );
    } catch (err: any) {
      const errorObj = parseError(err);
      setError(errorObj);
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(async () => {
    try {
      setLoading(true);
      // await chatService.clearHistory();
      setMessages([]);
      setError(null);
    } catch (err: any) {
      const errorObj = parseError(err);
      setError(errorObj);
      console.error("Error clearing chat:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    input,
    setInput,
    loading,
    error,
    loadHistory,
    sendMessage,
    clearMessages,
    clearError,
  };
};
