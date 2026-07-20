import {
  CoinsIcon,
  type IconProps,
  InboxIcon,
  ProfileIcon,
  ReceiptIcon,
  ScanIcon,
} from '@/assets/icons/home';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import type { ComponentType } from 'react';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type BottomTabKey = 'inbox' | 'receipt' | 'coins' | 'profile';

interface TabConfig {
  key: BottomTabKey;
  label: string;
  Icon: ComponentType<IconProps>;
}

const LEFT_TABS: readonly TabConfig[] = [
  { key: 'inbox', label: 'Inbox', Icon: InboxIcon },
  { key: 'receipt', label: 'Receipt', Icon: ReceiptIcon },
] as const;

const RIGHT_TABS: readonly TabConfig[] = [
  { key: 'coins', label: 'Coins', Icon: CoinsIcon },
  { key: 'profile', label: 'Profile', Icon: ProfileIcon },
] as const;

interface BottomNavBarProps {
  activeKey?: BottomTabKey;
  onTabPress?: (key: BottomTabKey) => void;
  onScanPress?: () => void;
}

function BottomNavBarComponent({ activeKey, onTabPress, onScanPress }: BottomNavBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      <View style={styles.bar}>
        <View style={styles.group}>
          {LEFT_TABS.map((tab) => (
            <TabButton
              key={tab.key}
              tab={tab}
              active={tab.key === activeKey}
              onPress={onTabPress}
            />
          ))}
        </View>

        <View style={styles.centerSlot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Scan Receipt"
            onPress={onScanPress}
            style={styles.scanButton}
          >
            <ScanIcon size={24} color={colors.white} />
          </Pressable>
          {/* Same vertical stack as side tabs so the title baseline matches. */}
          <View style={styles.scanLabelBlock}>
            <Text style={styles.scanLabel} numberOfLines={1} allowFontScaling={false}>
              Scan Receipt
            </Text>
            <View style={styles.indicator} />
          </View>
        </View>

        <View style={styles.group}>
          {RIGHT_TABS.map((tab) => (
            <TabButton
              key={tab.key}
              tab={tab}
              active={tab.key === activeKey}
              onPress={onTabPress}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

interface TabButtonProps {
  tab: TabConfig;
  active: boolean;
  onPress?: (key: BottomTabKey) => void;
}

function TabButton({ tab, active, onPress }: TabButtonProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={tab.label}
      onPress={() => onPress?.(tab.key)}
      style={styles.tab}
    >
      <tab.Icon size={24} color={colors.blackText} />
      <Text style={styles.tabLabel} numberOfLines={1}>
        {tab.label}
      </Text>
      <View style={[styles.indicator, active && styles.indicatorActive]} />
    </Pressable>
  );
}

const SCAN_SIZE = 60;
const SCAN_LABEL_WIDTH = 92;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 389,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: colors.strokeColor,
    borderRadius: 56,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 12,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  tab: {
    width: 66,
    minWidth: 65,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tabLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.blackText,
  },
  indicator: {
    width: 21,
    height: 2,
    borderRadius: 60,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: colors.primary,
  },
  centerSlot: {
    width: SCAN_LABEL_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // Match side-tab vertical padding so titles share one baseline.
    paddingVertical: 4,
  },
  scanLabelBlock: {
    alignItems: 'center',
    gap: 4,
  },
  scanLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.blackText,
    textAlign: 'center',
    width: SCAN_LABEL_WIDTH,
  },
  scanButton: {
    position: 'absolute',
    // Above the shared label+indicator stack (label 16 + gap 4 + indicator 2 + padding 4).
    bottom: 30,
    alignSelf: 'center',
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderRadius: 1000,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 2,
  },
});

export const BottomNavBar = memo(BottomNavBarComponent);
