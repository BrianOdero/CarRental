import { AuthProvider, useAuth } from "@/provider/AuthProvider";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { AppStorage } from "@/utils/storage"
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

function InitialLayout() {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    // Prevent multiple navigation attempts
    if (isNavigating) return;

    // Check onboarding status first
    const onboardingComplete = AppStorage.getOnboardingComplete();
    
    if (!onboardingComplete) {
      // If onboarding not complete, stay on index page
      if (segments.length > 0 && segments[0] !== 'index') {
        setIsNavigating(true);
        router.replace('/');
        setTimeout(() => setIsNavigating(false), 100);
      }
      return;
    }

    // Onboarding is complete, handle authentication routing
    if (session) {
      // User is authenticated, redirect to homepage if not already in auth group
      if (!inAuthGroup) {
        setIsNavigating(true);
        router.replace('/(auth)/homepage');
        setTimeout(() => setIsNavigating(false), 100);
      }
    } else {
      // User is not authenticated, redirect to login if trying to access protected routes
      if (inAuthGroup) {
        setIsNavigating(true);
        router.replace('/loginSignup');
        setTimeout(() => setIsNavigating(false), 100);
      }
    }
  }, [session, initialized, segments, isNavigating]);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#ff9500" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="loginSignup" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar barStyle="dark-content" />
        <InitialLayout />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}