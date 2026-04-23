/**
 * Root Navigation Setup
 * Main entry point for navigation with stack and tab navigators
 */

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// Feature Screens
import ChatbotScreen from "../../features/chat/screens/ChatBot";
import VoiceScreen from "../../features/voice/screens/voice";

// Types
export type RootStackParamList = {
  HomeTabs: undefined;
  ChatDetail: { chatId?: string };
  VoiceDetail: { voiceId?: string };
};

export type ChatTabParamList = {
  ChatList: undefined;
  ChatDetail: { chatId?: string };
};

export type VoiceTabParamList = {
  VoiceList: undefined;
  VoiceDetail: { voiceId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const ChatStack = createNativeStackNavigator<ChatTabParamList>();
const VoiceStack = createNativeStackNavigator<VoiceTabParamList>();
const Tab = createBottomTabNavigator();

/**
 * Chat Stack Navigator
 */
const ChatStackNavigator = () => {
  return (
    <ChatStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#0a7ea4",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <ChatStack.Screen
        name="ChatList"
        component={ChatbotScreen}
        options={{
          title: "Chat",
          headerShown: false,
        }}
      />
      <ChatStack.Screen
        name="ChatDetail"
        component={ChatbotScreen}
        options={{
          title: "Chat Details",
        }}
      />
    </ChatStack.Navigator>
  );
};

/**
 * Voice Stack Navigator
 */
const VoiceStackNavigator = () => {
  return (
    <VoiceStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#0a7ea4",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <VoiceStack.Screen
        name="VoiceList"
        component={VoiceScreen}
        options={{
          title: "Voice",
          headerShown: false,
        }}
      />
      <VoiceStack.Screen
        name="VoiceDetail"
        component={VoiceScreen}
        options={{
          title: "Voice Details",
        }}
      />
    </VoiceStack.Navigator>
  );
};

/**
 * Bottom Tab Navigator
 */
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Chat") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Voice") {
            iconName = focused ? "mic" : "mic-outline";
          } else {
            iconName = "home";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0a7ea4",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e0e0e0",
        },
      })}
    >
      <Tab.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          tabBarLabel: "Chat",
        }}
      />
      <Tab.Screen
        name="Voice"
        component={VoiceStackNavigator}
        options={{
          tabBarLabel: "Voice",
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Root Stack Navigator
 */
const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeTabs" component={TabNavigator} />
    </Stack.Navigator>
  );
};

/**
 * Main Navigation Container
 */
export const RootNavigation = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default RootNavigation;
