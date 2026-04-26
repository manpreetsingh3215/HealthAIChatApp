/**
 * ChatHeader Component
 * Header with title and clear button
 */

import { FitnessColors } from "@/shared/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ChatHeaderProps {
  messageCount: number;
  onClear: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  messageCount,
  onClear,
}) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>FitnessAI Chat</Text>
        <Text style={styles.subtitle}>{messageCount} messages</Text>
      </View>
      {/* <TouchableOpacity style={styles.clearButton} onPress={onClear}>
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
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
});
