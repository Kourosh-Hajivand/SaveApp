import ControlledInput from "@/components/input/ControlledInput";
import ControlledPhoneNumber from "@/components/inputs/ControlledPhoneNumber";
import SocialLogin from "@/components/SocialLogin";
import { useSignIn } from "@/hooks";
import { normalizeString } from "@/utils/helpers/query";
import { LoginSchema, type LoginSchemaType } from "@/utils/validation/auth/LoginSchema";
import { Button, Host, Text as SwiftText, VStack } from "@expo/ui/swift-ui";
import { buttonStyle, controlSize, disabled, frame, tint } from "@expo/ui/swift-ui/modifiers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";
import { Colors } from "toastify-react-native/config/theme";

const fillWidth = frame({ maxWidth: Infinity });

const SWITCH_DURATION = 220;

export default function LoginForm() {
  const router = useRouter();
  const [isMobileLogin, setIsMobileLogin] = useState(true);
  const { mutate: signIn, isPending } = useSignIn();
  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema(isMobileLogin)),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginSchemaType> = (data) => {
    signIn(
      {
        username: normalizeString(data.username),
        password: data.password,
      },
      {
        onSuccess: () => {
          router.replace("/(main)");
        },
      },
    );
  };

  const handleToggleLoginType = () => {
    setIsMobileLogin((prev) => !prev);
    reset({ username: "", password: "" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.fields}>
        <View style={styles.usernameBlock}>
          <Animated.View layout={LinearTransition.duration(SWITCH_DURATION)} style={styles.usernameSwitch}>
            {isMobileLogin ? (
              <Animated.View
                key="phone"
                entering={FadeInLeft.duration(SWITCH_DURATION)}
                exiting={FadeOutLeft.duration(SWITCH_DURATION)}
              >
                <ControlledPhoneNumber
                  name="username"
                  control={control}
                  label="Phone"
                  rules={{ required: true }}
                />
              </Animated.View>
            ) : (
              <Animated.View
                key="email"
                entering={FadeInRight.duration(SWITCH_DURATION)}
                exiting={FadeOutRight.duration(SWITCH_DURATION)}
              >
                <ControlledInput
                  name="username"
                  control={control}
                  label="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={errors.username?.message}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </Animated.View>
            )}
          </Animated.View>

          <Pressable onPress={handleToggleLoginType} style={styles.toggleRow}>
            <Text style={styles.muted}>Login using</Text>
            <Text style={styles.link}>{!isMobileLogin ? "Phone" : "Email"}</Text>
          </Pressable>
        </View>

        <ControlledInput name="password" control={control} label="Password" type="password" autoComplete="password" error={errors.password?.message} returnKeyType="done" blurOnSubmit onSubmitEditing={handleSubmit(onSubmit)} ref={passwordRef} />

        <View style={styles.forgotRow}>
          <Text style={styles.body}>Did you</Text>
          <Link href="/(auth)/forgot-password" asChild>
            <Pressable>
              <Text style={styles.link}>Forgot your password?</Text>
            </Pressable>
          </Link>
        </View>

        <Text style={styles.or}>Or</Text>
        <SocialLogin />
      </View>
      <Host matchContents={{ vertical: true }} style={styles.host}>
        <VStack modifiers={[fillWidth]}>
          <Button
            onPress={isPending ? undefined : handleSubmit(onSubmit)}
            modifiers={[
              fillWidth,
              buttonStyle("glassProminent"),
              controlSize("large"),
              tint(Colors.primary),
              ...(isPending ? [disabled()] : []),
            ]}
          >
            <SwiftText modifiers={[fillWidth]}>
              {isPending ? "Logging in..." : "Login"}
            </SwiftText>
          </Button>
        </VStack>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 40,
  },
  host: {
    width: "100%",
    alignSelf: "stretch",
  },
  fields: {
    width: "100%",
    gap: 8,
  },
  usernameBlock: {
    width: "100%",
  },
  usernameSwitch: {
    width: "100%",
    overflow: "hidden",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  forgotRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  muted: {
    color: "#999999",
    fontSize: 12,
  },
  link: {
    color: "#0466C8",
    fontSize: 12,
  },
  body: {
    color: "#28262E",
    fontSize: 14,
  },
  or: {
    textAlign: "center",
    color: Colors.strokeColor,
    fontSize: 14,
    marginVertical: 8,
  },
});
