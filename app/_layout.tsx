import { AuthProvider, useAuth } from "@/provider/AuthProvider";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { VehicleProvider } from "@/contexts/VehicleContext";

export default function RootLayout() {
  const InitialLayout = () => {
    const { session, initialized } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // Authentication middleware
    useEffect(() => {
      if (!initialized) {
        setIsLoading(true);
        return;
      }

      const inAuthGroup = segments[0] === '(auth)';
      
      // Check authentication state and route accordingly
      if (session) {
        // Redirect authenticated users away from auth pages
        if (!inAuthGroup) {
          router.replace('/(auth)/homepage');
        }
      } else {
        // Redirect unauthenticated users to login if trying to access protected routes
        if (inAuthGroup) {
          router.replace('/loginSignup');
        }
      }
      
      setIsLoading(false);
    }, [session, initialized, segments]);

    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="loginSignup" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <VehicleProvider>
        <StatusBar barStyle={"dark-content"}/>
        <AuthProvider>
          <InitialLayout />
        </AuthProvider>
      </VehicleProvider>
    </GestureHandlerRootView>
  );
}