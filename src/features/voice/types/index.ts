/**
 * Voice Feature - Types
 */

export interface VoiceTranscriptionResponse {
  text: string;
  confidence?: number;
}

export interface TextToSpeechResponse {
  audioUrl: string;
  duration?: number;
}
