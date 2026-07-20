import { Stack } from "expo-router";
import { Colors } from "toastify-react-native/config/theme";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        headerShown: true,
        headerTransparent: true,
        headerTitle: "",
        headerShadowVisible: false,
        headerTintColor: Colors.primary,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="login-signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
