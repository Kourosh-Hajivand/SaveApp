import ControlledInput from '@/components/input/ControlledInput';
import ControlledPhoneNumber from '@/components/inputs/ControlledPhoneNumber';
import SocialLogin from '@/components/SocialLogin';
import { useSignUp } from '@/hooks';
import { normalizeString } from '@/utils/helpers/query';
import {
  RegisterSchema,
  type RegisterSchemaType,
} from '@/utils/validation/RegisterSchema';
import { Button, Host, Text as SwiftText, VStack } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize, disabled, frame, tint } from '@expo/ui/swift-ui/modifiers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  LinearTransition,
} from 'react-native-reanimated';
import { Colors } from 'toastify-react-native/config/theme';

const fillWidth = frame({ maxWidth: Infinity });
const SWITCH_DURATION = 220;

export default function SignupForm() {
  const router = useRouter();
  const [isMobileSignup, setIsMobileSignup] = useState(true);
  const { mutate: signUp, isPending } = useSignUp();
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema(isMobileSignup)),
    defaultValues: {
      username: '',
      password: '',
      confirmpassword: '',
    },
    mode: 'onChange',
  });

  const handleToggleSignupType = () => {
    setIsMobileSignup((prev) => !prev);
    reset({ username: '', password: '', confirmpassword: '' });
  };

  const onSubmit: SubmitHandler<RegisterSchemaType> = (data) => {
    const isPhoneNumber = /^\+?[0-9]/.test(data.username);

    signUp(
      {
        ...(isPhoneNumber
          ? { mobile: data.username }
          : { email: normalizeString(data.username) }),
        password: data.password,
      },
      {
        onSuccess: (response) => {
          router.push({
            pathname: '/(auth)/otp-verification',
            params: {
              username: data.username,
              token: response.token,
              flow: 'signup',
            },
          });
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.fields}>
        <View style={styles.usernameBlock}>
          <Animated.View
            layout={LinearTransition.duration(SWITCH_DURATION)}
            style={styles.usernameSwitch}
          >
            {isMobileSignup ? (
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

          <Pressable onPress={handleToggleSignupType} style={styles.toggleRow}>
            <Text style={styles.muted}>Sign up using</Text>
            <Text style={styles.link}>{!isMobileSignup ? 'Phone' : 'Email'}</Text>
          </Pressable>
        </View>

        <ControlledInput
          name="password"
          control={control}
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          ref={passwordRef}
        />

        <ControlledInput
          name="confirmpassword"
          control={control}
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmpassword?.message}
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={handleSubmit(onSubmit)}
          ref={confirmPasswordRef}
        />

        <Text style={styles.or}>Or</Text>
        <SocialLogin />
      </View>

      <Host matchContents={{ vertical: true }} style={styles.host}>
        <VStack modifiers={[fillWidth]}>
          <Button
            onPress={isPending ? undefined : handleSubmit(onSubmit)}
            modifiers={[
              fillWidth,
              buttonStyle('glassProminent'),
              controlSize('large'),
              tint(Colors.primary),
              ...(isPending ? [disabled()] : []),
            ]}
          >
            <SwiftText modifiers={[fillWidth]}>
              {isPending ? 'Signing up...' : 'Signup'}
            </SwiftText>
          </Button>
        </VStack>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 40,
  },
  host: {
    width: '100%',
    alignSelf: 'stretch',
  },
  fields: {
    width: '100%',
    gap: 8,
  },
  usernameBlock: {
    width: '100%',
  },
  usernameSwitch: {
    width: '100%',
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  muted: {
    color: '#999999',
    fontSize: 12,
  },
  link: {
    color: '#0466C8',
    fontSize: 12,
  },
  or: {
    textAlign: 'center',
    color: Colors.strokeColor,
    fontSize: 14,
    marginVertical: 8,
  },
});
