import { AuthGuard } from '@/components/AuthGuard';
import ControlledInput from '@/components/input/ControlledInput';
import { useUpdatePassword } from '@/hooks';
import {
  ResetPasswordSchema,
  type ResetPasswordSchemaType,
} from '@/utils/validation/auth/ResetPasswordSchema';
import { Button, Host, Text as SwiftText, VStack } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize, disabled, frame, tint } from '@expo/ui/swift-ui/modifiers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from 'toastify-react-native/config/theme';

const fillWidth = frame({ maxWidth: Infinity });

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    accessToken?: string;
    refreshToken?: string;
  }>();
  const { mutate: updatePassword, isPending } = useUpdatePassword();
  const confirmPasswordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema()),
    defaultValues: {
      newPassword: '',
      confirmpassword: '',
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordSchemaType> = (data) => {
    void params.accessToken;
    void params.refreshToken;

    updatePassword(
      { password: data.newPassword },
      {
        onSuccess: () => {
          router.replace('/(auth)/login-signup');
        },
      },
    );
  };

  return (
    <AuthGuard requireAuth={false}>
      <View style={styles.container}>
        <View style={styles.copy}>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.body}>Choose a new password for your account.</Text>
        </View>

        <View style={styles.fields}>
          <ControlledInput
            name="newPassword"
            control={control}
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
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
                {isPending ? 'Updating...' : 'Update password'}
              </SwiftText>
            </Button>
          </VStack>
        </Host>
      </View>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 100,
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
    color: '#999999',
  },
  fields: {
    width: '100%',
    gap: 8,
  },
  host: {
    width: '100%',
    alignSelf: 'stretch',
  },
});
