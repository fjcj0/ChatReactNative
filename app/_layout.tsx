import { Stack } from "expo-router";
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "start" }} />
      <Stack.Screen name="signup" options={{ title: "signup" }} />
      <Stack.Screen name="signin" options={{ title: "signin" }} />
    </Stack>
  );
}