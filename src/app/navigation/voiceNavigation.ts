/**
 * Voice Navigation Configuration
 * Voice-specific navigation and screens
 */

import { NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type VoiceNavigationParamList = {
  VoiceHome: undefined;
  VoiceDetail: { voiceId: string };
  VoiceSettings: undefined;
};

export type VoiceNavigationProp = NavigationProp<VoiceNavigationParamList>;

const Stack = createNativeStackNavigator<VoiceNavigationParamList>();

export const voiceNavigationConfig = {
  screenOptions: {
    headerShown: true,
    headerStyle: {
      backgroundColor: "#fff",
    },
    headerTintColor: "#0a7ea4",
    headerTitleStyle: {
      fontWeight: "600",
      fontSize: 16,
    },
  },
};

export const voiceScreenOptions = {
  title: "Voice",
  headerBackTitle: "Back",
};
