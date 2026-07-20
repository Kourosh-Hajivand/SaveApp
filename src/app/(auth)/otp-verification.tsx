import { AuthGuard } from '@/components/AuthGuard';
import CountdownTimer from '@/components/CountdownTimer';
import OTPCode from '@/components/OTP';
import { OTP_LENGTH, OTP_RESEND_SECONDS } from '@/constants/auth';
import { useRequestOTP, useVerifyToken } from '@/hooks';
import { Button, Host, Text as SwiftText, VStack } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize, disabled, frame, tint } from '@expo/ui/swift-ui/modifiers';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from 'toastify-react-native/config/theme';

const fillWidth = frame({ maxWidth: Infinity });

export default function OTPVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    username?: string;
    token?: string;
    flow?: string;
  }>();
  const [otp, setOtp] = useState('');
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const { mutate: verifyToken, isPending } = useVerifyToken();
  const { mutate: requestOTP, isPending: isRequestOTPPending } = useRequestOTP();

  const username = params.username?.toString() ?? '';
  const token = params.token?.toString() ?? '';
  const flow = params.flow?.toString() === 'signup' ? 'signup' : 'forgot';
  const canVerify = otp.length === OTP_LENGTH && Boolean(token);

  const resetOtpInput = () => {
    setOtp('');
    setCanResend(false);
    setTimerResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (otp.length === OTP_LENGTH && token) {
      verifyToken(
        { code: otp, token },
        {
          onSuccess: (data) => {
            if (flow === 'signup') {
              router.replace('/(main)');
              return;
            }

            router.push({
              pathname: '/(auth)/reset-password',
              params: {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              },
            });
          },
        },
      );
    }
  }, [otp, token, verifyToken, router, flow]);

  return (
    <AuthGuard requireAuth={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.copy}>
            <Text style={styles.title}>Enter verification code</Text>
            <Text style={styles.body}>We sent a 5-digit verification code to</Text>
            <Text style={styles.username}>{username}</Text>
            <Pressable
              onPress={() =>
                router.push(
                  flow === 'signup'
                    ? { pathname: '/(auth)/login-signup', params: { defaultTab: 'signup' } }
                    : '/(auth)/forgot-password',
                )
              }
            >
              <Text style={styles.link}>Change it</Text>
            </Pressable>
          </View>

          <OTPCode length={OTP_LENGTH} value={otp} onChange={setOtp} />

          <View style={styles.resendRow}>
            <CountdownTimer
              key={timerResetKey}
              initialTime={OTP_RESEND_SECONDS}
              onComplete={() => setCanResend(true)}
            />
            <Pressable
              disabled={isRequestOTPPending || !canResend}
              onPress={() =>
                requestOTP(
                  { username },
                  {
                    onSuccess: resetOtpInput,
                  },
                )
              }
            >
              <Text
                style={[
                  styles.link,
                  (!canResend || isRequestOTPPending) && styles.linkDisabled,
                ]}
              >
                Resend it
              </Text>
            </Pressable>
          </View>

          <Host matchContents={{ vertical: true }} style={styles.host}>
            <VStack modifiers={[fillWidth]}>
              <Button
                onPress={
                  isPending || !canVerify
                    ? undefined
                    : () => verifyToken({ code: otp, token })
                }
                modifiers={[
                  fillWidth,
                  buttonStyle('glassProminent'),
                  controlSize('large'),
                  tint(Colors.primary),
                  ...(isPending || !canVerify ? [disabled()] : []),
                ]}
              >
                <SwiftText modifiers={[fillWidth]}>
                  {isPending ? 'Verifying...' : 'Verify code'}
                </SwiftText>
              </Button>
            </VStack>
          </Host>
        </View>

        <Image
          source={require('../../../assets/images/AuthPage/BottomBackground.png')}
          style={styles.footer}
          contentFit="cover"
        />
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
    paddingTop: 100,
    paddingHorizontal: 30,
    gap: 24,
  },
  copy: {
    gap: 8,
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
  username: {
    fontSize: 15,
    fontWeight: '500',
    color: '#28262E',
  },
  link: {
    color: '#0466C8',
    fontSize: 14,
  },
  linkDisabled: {
    opacity: 0.4,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  host: {
    width: '100%',
    alignSelf: 'stretch',
  },
  footer: {
    width: '100%',
    height: '20%',
  },
});
