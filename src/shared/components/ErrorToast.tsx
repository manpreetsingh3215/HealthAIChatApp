/**
 * Error Toast Component
 * Displays error messages with dismiss button
 */

import React, { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ErrorToastProps {
  message: string;
  details?: string;
  onDismiss: () => void;
  duration?: number;
  visible: boolean;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  message,
  details,
  onDismiss,
  duration = 0, // 0 means don't auto-dismiss
  visible,
}) => {
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Slide in animation
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto dismiss if duration is set
      if (duration > 0) {
        const timer = setTimeout(() => {
          dismissToast();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [visible]);

  const dismissToast = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 0],
  });

  return (
    <SafeAreaView style={styles.safeContainer} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>⚠️ Error</Text>
            <Text style={styles.message}>{message}</Text>
            {details && <Text style={styles.details}>{details}</Text>}
          </View>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={dismissToast}
            activeOpacity={0.7}
          >
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: "transparent",
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#c62828",
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#c62828",
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: "#c62828",
    lineHeight: 18,
    marginBottom: 2,
  },
  details: {
    fontSize: 11,
    color: "#b71c1c",
    lineHeight: 16,
    marginTop: 4,
    fontStyle: "italic",
    opacity: 0.8,
  },
  dismissButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(198, 40, 40, 0.1)",
    borderRadius: 14,
  },
  dismissText: {
    fontSize: 18,
    color: "#c62828",
    fontWeight: "bold",
  },
});
