import { AuthGuard } from '@/components/AuthGuard';
import ControlledInput from '@/components/input/ControlledInput';
import ControlledPhoneNumber from '@/components/inputs/ControlledPhoneNumber';
import { useRequestOTP } from '@/hooks';
import { normalizeString } from '@/utils/helpers/query';
import {
  ForgetPasswordSchema,
  type ForgetPasswordSchemaType,
} from '@/utils/validation/auth/ForgetPasswordSchema';
import { Button, Host, Text as SwiftText, VStack } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize, disabled, frame, tint } from '@expo/ui/swift-ui/modifiers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isMobileLogin, setIsMobileLogin] = useState(true);
  const { mutate: requestOTP, isPending } = useRequestOTP();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgetPasswordSchemaType>({
    resolver: zodResolver(ForgetPasswordSchema(isMobileLogin)),
    defaultValues: {
      username: '',
    },
  });

  const onSubmit: SubmitHandler<ForgetPasswordSchemaType> = (data) => {
    requestOTP(
      { username: normalizeString(data.username) },
      {
        onSuccess: (response) => {
          router.push({
            pathname: '/(auth)/otp-verification',
            params: {
              username: data.username,
              token: response.token,
              flow: 'forgot',
            },
          });
        },
      },
    );
  };

  const handleToggle = () => {
    setIsMobileLogin((prev) => !prev);
    reset({ username: '' });
  };

  return (
    <AuthGuard requireAuth={false}>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/images/AuthPage/BottomBackground.png')}
          style={styles.footer}
          contentFit="cover"
        />

        <View style={styles.content}>
          <View style={styles.copy}>
            <Text style={styles.title}>
              {isMobileLogin ? 'Enter your phone number' : 'Enter your email address'}
            </Text>
            <Text style={styles.body}>
              We will send a 5-digit verification code to your account.
            </Text>
          </View>

          <View style={styles.fields}>
            <View style={styles.usernameBlock}>
              <Animated.View
                layout={LinearTransition.duration(SWITCH_DURATION)}
                style={styles.usernameSwitch}
              >
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
                      returnKeyType="done"
                      blurOnSubmit
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                  </Animated.View>
                )}
              </Animated.View>

              <Pressable onPress={handleToggle} style={styles.toggleRow}>
                <Text style={styles.muted}>Use</Text>
                <Text style={styles.link}>{!isMobileLogin ? 'Phone' : 'Email'}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.buttonWrap}>
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
                  {isPending ? 'Sending...' : 'Get code'}
                </SwiftText>
              </Button>
            </VStack>
          </Host>
        </View>
      </View>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  content: {
    paddingTop: 140,
    paddingHorizontal: 30,
    gap: 24,
  },
  copy: {
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#28262E',
  },
  body: {
    fontSize: 15,
    color: '#28262E',
    fontWeight: '300',
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
  buttonWrap: {
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 200,
  },
  host: {
    width: '100%',
    alignSelf: 'stretch',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: 180,
  },
});


