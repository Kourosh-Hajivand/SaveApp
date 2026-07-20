import {
  Host,
  Button as SwiftButton,
} from "@expo/ui/swift-ui";
import {
  buttonStyle,
  controlSize,
  disabled as disabledModifier,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import React, { type ComponentProps } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type AppButtonVariant = "primary" | "secondary" | "destructive";

export type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: AppButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  systemImage?: ComponentProps<typeof SwiftButton>["systemImage"];
};

const TINT_BY_VARIANT: Record<AppButtonVariant, string> = {
  primary: "#0466C8",
  secondary: "#004B55",
  destructive: "#C80404",
};

export default function Button({
  label,
  onPress,
  variant = "primary",
  isLoading = false,
  disabled = false,
  style,
  systemImage,
}: AppButtonProps) {
  const isDisabled = disabled || isLoading;

  if (Platform.OS === "ios") {
    return (
      <View style={[styles.hostWrap, style]}>
        <Host matchContents style={styles.host}>
          <SwiftButton
            label={isLoading ? `${label}…` : label}
            systemImage={systemImage}
            onPress={isDisabled ? undefined : onPress}
            modifiers={[
              buttonStyle(variant === "secondary" ? "bordered" : "borderedProminent"),
              controlSize("large"),
              tint(TINT_BY_VARIANT[variant]),
              ...(isDisabled ? [disabledModifier()] : []),
            ]}
          />
        </Host>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.fallback,
        variant === "secondary" && styles.fallbackSecondary,
        variant === "destructive" && styles.fallbackDestructive,
        isDisabled && styles.fallbackDisabled,
        pressed && !isDisabled && styles.fallbackPressed,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === "secondary" ? "#0466C8" : "#FFFFFF"} />
      ) : (
        <Text
          style={[
            styles.fallbackLabel,
            variant === "secondary" && styles.fallbackLabelSecondary,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hostWrap: {
    width: "100%",
    minHeight: 48,
    justifyContent: "center",
  },
  host: {
    width: "100%",
  },
  fallback: {
    width: "100%",
    minHeight: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0466C8",
    paddingHorizontal: 16,
  },
  fallbackSecondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9E9E9",
  },
  fallbackDestructive: {
    backgroundColor: "#C80404",
  },
  fallbackDisabled: {
    opacity: 0.45,
  },
  fallbackPressed: {
    opacity: 0.85,
  },
  fallbackLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  fallbackLabelSecondary: {
    color: "#28262E",
  },
});
