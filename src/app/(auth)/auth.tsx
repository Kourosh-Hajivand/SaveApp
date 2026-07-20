import { Button, Host, HStack, Image as SFImage, Text, VStack } from "@expo/ui/swift-ui";
import { buttonStyle, controlSize, font, foregroundStyle, frame, tint } from "@expo/ui/swift-ui/modifiers";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "toastify-react-native/config/theme";

const fillWidth = frame({ maxWidth: Infinity });

export default function AuthScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Image source={require("../../../assets/images/AuthPage/AuthBackground.png")} style={styles.hero} contentFit="cover" />
      <View style={styles.content}>
        {/*
          Horizontal size comes from RN (width: 100%).
          Vertical size follows SwiftUI content (matchContents.vertical).
        */}
        <Host matchContents={{ vertical: true }} style={styles.host}>
          <VStack spacing={38} modifiers={[fillWidth]}>
            <HStack spacing={6}>
              <Text modifiers={[font({ size: 24, weight: "regular" }), foregroundStyle("#28262E")]}>Welcome to</Text>
              <Text modifiers={[font({ size: 24, weight: "bold" }), foregroundStyle("#004B55")]}>SAVE APP</Text>
            </HStack>

            <VStack spacing={24} modifiers={[fillWidth]}>
              <Button
                onPress={() =>
                  router.push({
                    pathname: "/(auth)/login-signup",
                    params: { defaultTab: "login" },
                  })
                }
                modifiers={[fillWidth, buttonStyle("glassProminent"), controlSize("large"), tint(Colors.primary)]}
              >
                <HStack spacing={4} modifiers={[fillWidth]}>
                  <Text>Login</Text>
                  <SFImage systemName="arrow.right" size={18} />
                </HStack>
              </Button>

              <Button
                onPress={() =>
                  router.push({
                    pathname: "/(auth)/login-signup",
                    params: { defaultTab: "signup" },
                  })
                }
                modifiers={[fillWidth, buttonStyle("bordered"), controlSize("large")]}
              >
                <Text modifiers={[fillWidth]}>Signup</Text>
              </Button>
            </VStack>
          </VStack>
        </Host>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  hero: {
    width: "100%",
    height: "54%",
  },
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 40,
    paddingBottom: 80,
    justifyContent: "flex-end",
  },
  host: {
    width: "100%",
    alignSelf: "stretch",
  },
});
