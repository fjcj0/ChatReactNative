import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { AuthChecker } from "./(tabs)/_layout";
export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthChecker>
        <Stack
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="index" options={{ title: "start" }} />
          <Stack.Screen name="signup" options={{ title: "signup" }} />
          <Stack.Screen name="signin" options={{ title: "signin" }} />
        </Stack>
      </AuthChecker>
    </AuthProvider>
  );
}