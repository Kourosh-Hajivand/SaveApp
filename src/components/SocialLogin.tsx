import { AppleIcon, GoogleIcon } from "@/assets/icons";
import OutlineButton from "@/components/button/ui/OutlineButton";
import { BaseText } from "@/components/text/BaseText";
import { spacing } from "@/styles/spaces";
import { StyleSheet, View } from "react-native";

type SocialLoginProps = {
  invitationCode?: string;
};

export default function SocialLogin(_props: SocialLoginProps) {
  return (
    <View style={styles.container}>
      <OutlineButton>
        <GoogleIcon width={20} height={20} />
        <BaseText type="Headline" color="system.black" weight="500">
          Continue with Google
        </BaseText>
      </OutlineButton>
      <OutlineButton>
        <AppleIcon width={20} height={20} />
        <BaseText type="Headline" color="system.black" weight="500">
          Continue with Apple
        </BaseText>
      </OutlineButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing["2"],
  },
});
