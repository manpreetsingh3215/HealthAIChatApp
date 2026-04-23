/**
 * Voice Feature - API Service
 */

import { apiClient } from "@/services/api";
import { TextToSpeechResponse, VoiceTranscriptionResponse } from "../types";

export const voiceService = {
  /**
   * Transcribe audio to text (Speech-to-Text)
   */
  transcribe: (audioData: FormData): Promise<VoiceTranscriptionResponse> => {
    return apiClient.post("/voice/transcribe", audioData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /**
   * Convert text to speech
   */
  synthesize: (text: string): Promise<TextToSpeechResponse> => {
    return apiClient.post("/voice/synthesize", { text });
  },
};
