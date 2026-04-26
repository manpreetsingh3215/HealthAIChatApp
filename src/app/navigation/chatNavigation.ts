/**
 * Chat Navigation Configuration
 * Chat-specific navigation and screens
 */

import { NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FitnessColors } from "@/shared/constants/theme";

export type ChatNavigationParamList = {
  ChatHome: undefined;
  ChatDetail: { chatId: string };
  ChatSettings: undefined;
};

export type ChatNavigationProp = NavigationProp<ChatNavigationParamList>;

const Stack = createNativeStackNavigator<ChatNavigationParamList>();

export const chatNavigationConfig = {
  screenOptions: {
    headerShown: true,
    headerStyle: {
      backgroundColor: FitnessColors.surface,
    },
    headerTintColor: FitnessColors.primary,
    headerTitleStyle: {
      fontWeight: "600",
      fontSize: 16,
      color: FitnessColors.textPrimary,
    },
  },
};

export const chatScreenOptions = {
  title: "Chat",
  headerBackTitle: "Back",
};
