/**
 * Core API Client Export
 * Feature-specific services are located in their respective features:
 * - Chat APIs: src/features/chat/services/chatApi.ts
 * - Voice APIs: src/features/voice/services/voiceApi.ts
 */

export { apiClient } from "./api";
export * from "./types";

/**
 * Health Check - Core Service
 */
import { apiClient } from "./api";

export const healthService = {
  /**
   * Check API health status
   */
  checkHealth: (): Promise<{ status: string }> => {
    return apiClient.get("/health");
  },
};
