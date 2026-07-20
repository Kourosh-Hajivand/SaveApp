import { ChevronRightIcon } from '@/assets/icons/home';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

interface HostedByCardProps {
  name: string;
  avatar: ImageSourcePropType;
  onPress?: () => void;
}

function HostedByCardComponent({ name, avatar, onPress }: HostedByCardProps) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Hosted by ${name}`}
        onPress={onPress}
        style={styles.card}
      >
        <View style={styles.left}>
          <Image source={avatar} style={styles.avatar} contentFit="cover" />
          <View style={styles.textColumn}>
            <Text style={styles.caption}>Hosted by</Text>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
          </View>
        </View>
        <ChevronRightIcon size={20} color={colors.blackText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingVertical: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgColor,
    borderWidth: 1,
    borderColor: colors.strokeColor,
    borderRadius: 999,
    padding: 4,
    paddingRight: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  avatar: {
    width: 51,
    height: 51,
    borderRadius: 999,
    backgroundColor: colors.gray50,
  },
  textColumn: {
    flexShrink: 1,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.slate500,
  },
  name: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: colors.blackText,
  },
});

export const HostedByCard = memo(HostedByCardComponent);
