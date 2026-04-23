/**
 * Voice Feature - Main Screen
 * Voice recording and playback interface
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Voice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<string[]>([]);

  const handleStartRecording = () => {
    setIsRecording(true);
    console.log("Recording started");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    console.log("Recording stopped");
    setRecordings((prev) => [...prev, `Recording ${Date.now()}`]);
  };

  const handlePlayRecording = (recordingId: string) => {
    console.log("Playing recording:", recordingId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Recording</Text>
        <Text style={styles.subtitle}>Record and transcribe audio</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Recording Button */}
        <View style={styles.recordingSection}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive,
            ]}
            onPress={isRecording ? handleStopRecording : handleStartRecording}
          >
            <Ionicons
              name={isRecording ? "square" : "mic"}
              size={40}
              color={isRecording ? "#fff" : "#0a7ea4"}
            />
            <Text
              style={[
                styles.recordButtonText,
                isRecording && styles.recordButtonTextActive,
              ]}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recordings List */}
        <View style={styles.recordingsSection}>
          <Text style={styles.sectionTitle}>Recordings</Text>
          {recordings.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="mic-off" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No recordings yet</Text>
            </View>
          ) : (
            recordings.map((recording, index) => (
              <View key={index} style={styles.recordingItem}>
                <View style={styles.recordingInfo}>
                  <Ionicons name="volume-high" size={24} color="#0a7ea4" />
                  <View style={styles.recordingDetails}>
                    <Text style={styles.recordingName}>{recording}</Text>
                    <Text style={styles.recordingTime}>0:45</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handlePlayRecording(recording)}
                  style={styles.playButton}
                >
                  <Ionicons name="play-circle" size={32} color="#0a7ea4" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#11181c",
  },
  subtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  recordingSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  recordButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#e8f4f8",
    borderWidth: 2,
    borderColor: "#0a7ea4",
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonActive: {
    backgroundColor: "#d32f2f",
    borderColor: "#d32f2f",
  },
  recordButtonText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#0a7ea4",
    textAlign: "center",
  },
  recordButtonTextActive: {
    color: "#fff",
  },
  recordingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181c",
    marginBottom: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: "#999",
  },
  recordingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  recordingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  recordingDetails: {
    marginLeft: 12,
    flex: 1,
  },
  recordingName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#11181c",
  },
  recordingTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  playButton: {
    padding: 8,
  },
});

export default Voice;
