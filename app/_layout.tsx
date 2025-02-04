import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-reanimated";
import { QueryProvider } from "@/providers";
import { initializeAuth } from "@/store";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  React.useEffect(() => {
    // 1. This is where the user's data from AsyncStorage is checked.
    initializeAuth();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <QueryProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="favorites/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="full_crypto/[cryptoId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="signup/index"
          options={{ headerShown: true, title: "Sign up" }}
        />
        <Stack.Screen
          name="login/index"
          options={{ headerShown: true, title: "Log in" }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />

      <StatusBar style="auto" backgroundColor="black" />
    </QueryProvider>
  );
}
