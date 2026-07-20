import { AuthGuard } from "@/components/AuthGuard";
import { LoginForm, SignupForm } from "@/features/auth";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthTab = "login" | "signup";

const TAB_ANIMATION_MS = 280;
// iOS-like ease curve (no bounce)
const IOS_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);

export default function LoginSignupScreen() {
  const params = useLocalSearchParams<{ defaultTab?: string }>();
  const [activeTab, setActiveTab] = useState<AuthTab>(params.defaultTab === "login" ? "login" : "signup");
  const [tabsWidth, setTabsWidth] = useState(0);
  const indicatorProgress = useSharedValue(activeTab === "login" ? 0 : 1);

  useEffect(() => {
    indicatorProgress.value = withTiming(activeTab === "login" ? 0 : 1, {
      duration: TAB_ANIMATION_MS,
      easing: IOS_EASING,
    });
  }, [activeTab, indicatorProgress]);

  const onTabsLayout = (event: LayoutChangeEvent) => {
    setTabsWidth(event.nativeEvent.layout.width);
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = tabsWidth / 2;
    const indicatorWidth = tabWidth * 0.6;
    const sideInset = (tabWidth - indicatorWidth) / 2;

    return {
      width: indicatorWidth,
      transform: [{ translateX: sideInset + indicatorProgress.value * tabWidth }],
    };
  });

  const handleTabPress = (tab: AuthTab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  const isLogin = activeTab === "login";

  return (
    <AuthGuard requireAuth={false}>
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <Image source={require("../../../assets/images/AuthPage/TopBackground.png")} style={styles.headerImage} contentFit="fill" />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.tabs} onLayout={onTabsLayout}>
            <Pressable style={styles.tab} onPress={() => handleTabPress("login")}>
              <Text style={[styles.tabLabel, isLogin && styles.tabLabelActive]}>Login</Text>
            </Pressable>
            <Pressable style={styles.tab} onPress={() => handleTabPress("signup")}>
              <Text style={[styles.tabLabel, !isLogin && styles.tabLabelActive]}>Signup</Text>
            </Pressable>

            {tabsWidth > 0 ? <Animated.View style={[styles.indicator, indicatorStyle]} /> : null}
          </View>

          <Animated.View layout={LinearTransition.duration(TAB_ANIMATION_MS).easing(IOS_EASING)} style={styles.formWrap}>
            {isLogin ? (
              <Animated.View key="login" entering={FadeInLeft.duration(TAB_ANIMATION_MS).easing(IOS_EASING)} exiting={FadeOutLeft.duration(180).easing(IOS_EASING)}>
                <LoginForm />
              </Animated.View>
            ) : (
              <Animated.View key="signup" entering={FadeInRight.duration(TAB_ANIMATION_MS).easing(IOS_EASING)} exiting={FadeOutRight.duration(180).easing(IOS_EASING)}>
                <SignupForm />
              </Animated.View>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerImage: {
    width: "100%",
    height: 200,
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    gap: 32,
  },
  tabs: {
    flexDirection: "row",
    position: "relative",
    paddingBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 16,
    color: "#999999",
  },
  tabLabelActive: {
    color: "#0466C8",
    fontWeight: "600",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#0466C8",
  },
  formWrap: {
    width: "100%",
  },
});
