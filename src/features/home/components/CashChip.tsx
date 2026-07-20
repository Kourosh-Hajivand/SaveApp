import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { CashBackIcon, CashOutIcon } from '@/assets/icons/home';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type CashChipKind = 'back' | 'out';

interface CashChipProps {
  kind: CashChipKind;
  percent: number;
  /** Highlighted style used inside promoted ("Hot Offers") cards. */
  highlighted?: boolean;
}

const LABELS: Record<CashChipKind, string> = {
  back: 'Cash back:',
  out: 'Cash out:',
};

function CashChipComponent({ kind, percent, highlighted = false }: CashChipProps) {
  const Icon = kind === 'back' ? CashBackIcon : CashOutIcon;
  const useHighlight = highlighted && kind === 'back';
  const valueColor = useHighlight ? colors.secondaryOrange : colors.slate500;

  return (
    <View style={[styles.chip, useHighlight ? styles.chipHighlight : styles.chipDefault]}>
      <Icon size={13} color={colors.slate500} />
      <Text style={styles.label}>{LABELS[kind]}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{percent}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chipDefault: {
    backgroundColor: colors.gray50,
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipHighlight: {
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: '#FFF4EC',
    // Soft glow — kept tight so parent scroll/clip doesn't cut a large shadow.
    shadowColor: '#FF7003',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.slate500,
  },
  value: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
});

export const CashChip = memo(CashChipComponent);
