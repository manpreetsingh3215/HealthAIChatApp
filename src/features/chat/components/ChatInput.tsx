/**
 * ChatInput Component
 * Reusable message input component with send button
 */

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  loading = false,
}) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input]}
        placeholder="Type your message..."
        placeholderTextColor="#999"
        value={input}
        onChangeText={setInput}
        multiline
        editable={!disabled && !loading}
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
          (!input.trim() || disabled || loading) && styles.sendButtonDisabled,
        ]}
        onPress={handleSend}
        disabled={!input.trim() || disabled || loading}
      >
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
