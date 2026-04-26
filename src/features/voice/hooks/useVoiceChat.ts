/**
 * useVoiceChat Hook
 * Speech recognition -> chat-stream (same API and streaming pattern as useChat)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { chatService } from "@/features/chat/services/chatApi";
import { ChatMessage } from "@/features/chat/types";

let SpeechRecognitionModule: any = null;
try {
  const speechRecognitionPackage = require("expo-speech-recognition");
  SpeechRecognitionModule = speechRecognitionPackage.ExpoSpeechRecognitionModule;
} catch {
  SpeechRecognitionModule = null;
}

export interface VoiceChatError {
  message: string;
  details?: string;
}

const parseError = (err: any): VoiceChatError => {
  if (!err) {
    return { message: "An unknown error occurred" };
  }

  if (err.response) {
    const data = err.response.data;
    if (data?.error?.message) {
      return {
        message: data.error.message,
        details: data.error.code || data.details || err.response.statusText,
      };
    }
    return {
      message: data?.message || err.message || "API Error",
      details: data?.details || data?.code || err.response.statusText,
    };
  }

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

  if (typeof err === "string") {
    return { message: err };
  }

  if (err.message) {
    return {
      message: err.message,
      details: err.details || err.statusText,
    };
  }

  return { message: "An error occurred. Please try again." };
};

export const useVoiceChat = () => {
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<VoiceChatError | null>(null);

  const lastFinalTranscriptRef = useRef("");

  const clearError = useCallback(() => setError(null), []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const sendTranscriptToChat = useCallback(async (text: string) => {
    const finalText = text.trim();
    if (!finalText) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: finalText,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setTranscript("");
    setError(null);

    try {
      setLoading(true);

      const aiMessageId = (Date.now() + 1).toString();
      let aiMessageAdded = false;

      const onChunk = (chunk: string) => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const aiMsgIndex = updatedMessages.findIndex(
            (m) => m.id === aiMessageId,
          );

          if (aiMsgIndex !== -1) {
            updatedMessages[aiMsgIndex] = {
              ...updatedMessages[aiMsgIndex],
              text: updatedMessages[aiMsgIndex].text + chunk,
            };
          } else if (!aiMessageAdded) {
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

      const response = await chatService.sendMessage(finalText, onChunk);

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
      setError(parseError(err));
      console.error("Voice chat stream error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!SpeechRecognitionModule?.addListener) return;

    const startSub = SpeechRecognitionModule.addListener("start", () => {
      setIsListening(true);
    });

    const endSub = SpeechRecognitionModule.addListener("end", () => {
      setIsListening(false);
    });

    const errorSub = SpeechRecognitionModule.addListener("error", (event: any) => {
      setIsListening(false);
      setError({
        message: event?.message || "Speech recognition failed.",
        details: event?.error,
      });
    });

    const resultSub = SpeechRecognitionModule.addListener("result", (event: any) => {
      const best = event?.results?.[0]?.transcript?.trim() || "";
      if (!best) return;

      if (event?.isFinal) {
        setTranscript(best);
        setInterimTranscript("");

        if (best !== lastFinalTranscriptRef.current) {
          lastFinalTranscriptRef.current = best;
          void sendTranscriptToChat(best);
        }
        return;
      }

      setInterimTranscript(best);
    });

    return () => {
      startSub?.remove?.();
      endSub?.remove?.();
      errorSub?.remove?.();
      resultSub?.remove?.();
    };
  }, [sendTranscriptToChat]);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      setInterimTranscript("");

      if (!SpeechRecognitionModule) {
        setError({
          message: "Speech recognition native module is not available.",
          details:
            "Create a development build (not Expo Go) and reinstall the app.",
        });
        return;
      }

      const permission = await SpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) {
        setError({ message: "Microphone and speech permission is required." });
        return;
      }

      SpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        addsPunctuation: true,
        continuous: false,
      });
    } catch (err) {
      setError(parseError(err));
    }
  }, []);

  const stopListening = useCallback(() => {
    try {
      if (!SpeechRecognitionModule) return;
      SpeechRecognitionModule.stop();
    } catch (err) {
      setError(parseError(err));
    }
  }, []);

  return {
    isListening,
    loading,
    interimTranscript,
    transcript,
    messages,
    error,
    startListening,
    stopListening,
    clearError,
    clearMessages,
  };
};
