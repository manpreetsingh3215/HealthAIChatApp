/**
 * Voice Feature - Main Screen
 * Speech-to-text, then same chat-stream + bubbles as ChatBot
 */

import { ChatMessage } from "@/features/chat/components/ChatMessage";
import { ErrorToast } from "@/shared/components/ErrorToast";
import { FitnessColors } from "@/shared/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useVoiceChat } from "../hooks/useVoiceChat";

const Voice = () => {
  const {
    isListening,
    loading,
    interimTranscript,
    messages,
    error,
    startListening,
    stopListening,
    clearError,
    clearMessages,
  } = useVoiceChat();

  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const statusBarFillHeight = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0,
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const handleMicPress = async () => {
    if (loading) return;
    if (isListening) {
      stopListening();
      return;
    }
    await startListening();
  };

  return (
    <View style={styles.screenRoot}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={FitnessColors.secondary}
        translucent={Platform.OS === "android"}
      />
      <View style={[styles.statusBarFill, { height: statusBarFillHeight }]} />
      <SafeAreaView
        style={styles.container}
        edges={["bottom", "left", "right"]}
      >
        <ErrorToast
          visible={!!error}
          message={error?.message || ""}
          details={error?.details}
          onDismiss={clearError}
        />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Fitness AI Voice</Text>
            <Text style={styles.headerSubtitle}>
              {messages.length} messages · chat-stream
            </Text>
          </View>
          <TouchableOpacity style={styles.clearButton} onPress={clearMessages}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator
        >
          {messages.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🎙️</Text>
              <Text style={styles.emptyStateTitle}>No messages yet</Text>
              <Text style={styles.emptyStateText}>
                Tap the mic and speak — your words go to the same AI chat stream
                as the text chat.
              </Text>
            </View>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0a7ea4" />
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.micBar}>
          {!!interimTranscript && (
            <Text style={styles.interimText}>{interimTranscript}</Text>
          )}

          <TouchableOpacity
            style={[
              styles.recordButton,
              isListening && styles.recordButtonActive,
              loading && styles.recordButtonDisabled,
            ]}
            onPress={handleMicPress}
            disabled={loading}
          >
            <Ionicons
              name={isListening ? "square" : "mic"}
              size={36}
              color={isListening ? "#fff" : FitnessColors.primary}
            />
            <Text
              style={[
                styles.recordButtonText,
                isListening && styles.recordButtonTextActive,
              ]}
            >
              {loading ? "Streaming..." : isListening ? "Stop" : "Speak"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: FitnessColors.background,
  },
  statusBarFill: {
    backgroundColor: FitnessColors.secondary,
  },
  container: {
    flex: 1,
    backgroundColor: FitnessColors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: FitnessColors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: FitnessColors.secondary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  messagesContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: FitnessColors.textPrimary,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: FitnessColors.textSecondary,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    color: FitnessColors.textSecondary,
    fontSize: 12,
  },
  micBar: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: FitnessColors.surface,
    borderTopWidth: 1,
    borderTopColor: FitnessColors.border,
  },
  interimText: {
    fontSize: 13,
    color: FitnessColors.textSecondary,
    textAlign: "center",
    marginBottom: 10,
    alignSelf: "stretch",
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: FitnessColors.muted,
    borderWidth: 2,
    borderColor: FitnessColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonActive: {
    backgroundColor: FitnessColors.accentAI,
    borderColor: FitnessColors.accentAI,
  },
  recordButtonDisabled: {
    opacity: 0.7,
  },
  recordButtonText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: FitnessColors.primary,
    textAlign: "center",
  },
  recordButtonTextActive: {
    color: "#fff",
  },
});

export default Voice;
