/**
 * Chat Chatbot Screen
 * Complete chatbot UI with message history, input, and AI integration
 */

import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
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
  } = useChat();
  const scrollViewRef = useRef<ScrollView>(null);

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
   * Clear chat history
   */
  const handleClearChat = async () => {
    await clearMessages();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>VoiceAI Chat</Text>
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

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
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
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#11181c",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0a7ea4",
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
    color: "#11181c",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
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
    backgroundColor: "#0a7ea4",
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    backgroundColor: "#e0e0e0",
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
    color: "#11181c",
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
    color: "#999",
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
    color: "#c62828",
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 14,
    color: "#11181c",
  },
  sendButton: {
    backgroundColor: "#0a7ea4",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default Chatbot;
