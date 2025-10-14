import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(chat)");
      }
    }
  }, [user]);
  return <>{children}</>;
}
export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthWrapper>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{ title: "start" }} />
          <Stack.Screen name="signup" options={{ title: "signup" }} />
          <Stack.Screen name="signin" options={{ title: "signin" }} />
        </Stack>
      </AuthWrapper>
    </AuthProvider>
  );
}
