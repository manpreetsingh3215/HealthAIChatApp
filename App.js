/**
 * Main App Entry Point
 * Root navigation setup
 */

import RootNavigation from '@/app/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <RootNavigation />
    </SafeAreaProvider>
  );
}