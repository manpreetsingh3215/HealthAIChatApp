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
import { FitnessColors } from "@/shared/constants/theme";

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
        placeholderTextColor={FitnessColors.textSecondary}
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
