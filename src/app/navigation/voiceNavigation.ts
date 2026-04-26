/**
 * Voice Navigation Configuration
 * Voice-specific navigation and screens
 */

import { NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FitnessColors } from "@/shared/constants/theme";

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
      backgroundColor: FitnessColors.surface,
    },
    headerTintColor: FitnessColors.secondary,
    headerTitleStyle: {
      fontWeight: "600",
      fontSize: 16,
      color: FitnessColors.textPrimary,
    },
  },
};

export const voiceScreenOptions = {
  title: "Voice",
  headerBackTitle: "Back",
};
