import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { LogoIcon, MenuIcon, SearchIcon } from '@/assets/icons/home';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface HomeHeaderProps {
  onSearchPress?: () => void;
  onMenuPress?: () => void;
}

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

function HomeHeaderComponent({ onSearchPress, onMenuPress }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <LogoIcon size={22} color={colors.blackText} />
        <Text style={styles.brandText}>SAVE APP</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search"
          hitSlop={HIT_SLOP}
          onPress={onSearchPress}
        >
          <SearchIcon size={24} color={colors.blackText} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Menu"
          hitSlop={HIT_SLOP}
          onPress={onMenuPress}
        >
          <MenuIcon size={24} color={colors.blackText} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  brandText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.blackText,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
});

export const HomeHeader = memo(HomeHeaderComponent);
