/**
 * Chat Chatbot Screen
 * Complete chatbot UI with message history, input, and AI integration
 */

import { ErrorToast } from "@/shared/components/ErrorToast";
import { FitnessColors } from "@/shared/constants/theme";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useChat } from "../hooks/useChat";
import { ChatMessage as ChatMessageType } from "../types";

const Chatbot = () => {
  const {
    messages,
    input,
    setInput,
    loading,
    error,
    // loadHistory,
    sendMessage,
    clearMessages,
    clearError,
  } = useChat();
  const scrollViewRef = useRef<ScrollView>(null);
  const [toastVisible, setToastVisible] = useState(false);

  // Show toast when error occurs
  useEffect(() => {
    if (error) {
      setToastVisible(true);
    }
  }, [error]);

  // Load chat history on mount
  //   useEffect(() => {
  //     loadHistory();
  //   }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  /**
   * Handle send message
   */
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
  };

  /**
   * Handle error toast dismiss
   */
  const handleDismissError = () => {
    setToastVisible(false);
    clearError();
  };

  /**
   * Clear chat history
   */
  const handleClearChat = async () => {
    await clearMessages();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={FitnessColors.secondary}
        barStyle="light-content"
      />
      <ErrorToast
        visible={toastVisible}
        message={error?.message || ""}
        details={error?.details}
        onDismiss={handleDismissError}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>FitnessAI Chat</Text>
            <Text style={styles.headerSubtitle}>
              {messages.length} messages
            </Text>
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearChat}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Messages Area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>💬</Text>
              <Text style={styles.emptyStateTitle}>No messages yet</Text>
              <Text style={styles.emptyStateText}>
                Start a conversation with AI
              </Text>
            </View>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0a7ea4" />
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            multiline
            editable={!loading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!input.trim() || loading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/**
 * Message Bubble Component
 */
interface MessageBubbleProps {
  message: ChatMessageType;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <View
      style={[
        styles.messageBubbleContainer,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
      >
        <Text
          style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}
        >
          {message.text}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(message.timestamp || "").toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FitnessColors.background,
  },
  flex: {
    flex: 1,
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
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
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
  messageBubbleContainer: {
    marginVertical: 8,
    flexDirection: "row",
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  aiContainer: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: FitnessColors.primary,
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    backgroundColor: FitnessColors.accentAI,
    borderBottomLeftRadius: 2,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  aiText: {
    color: "#FFFFFF",
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.6,
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
  errorContainer: {
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#c62828",
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: FitnessColors.surface,
    borderTopWidth: 1,
    borderTopColor: FitnessColors.border,
  },
  input: {
    flex: 1,
    backgroundColor: FitnessColors.muted,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 14,
    color: FitnessColors.textPrimary,
  },
  sendButton: {
    backgroundColor: FitnessColors.secondary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: FitnessColors.disabled,
    opacity: 0.6,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default Chatbot;
