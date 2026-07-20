import { GradientText } from '@/components/text/GradientText';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { BalanceSummary } from '../types';

interface BalanceCardProps {
  balance: BalanceSummary;
}

/** Subtle white -> light-gray sheen laid over each half, matching Figma. */
const SHEEN_COLORS = ['rgba(255,255,255,0)', 'rgba(191,191,191,0.3)'] as const;
const SHEEN_LOCATIONS = [0.24, 1] as const;

type HalfSide = 'left' | 'right';

interface BalanceHalfProps {
  side: HalfSide;
  amount: number;
  children: ReactNode;
}

function BalanceHalf({ side, amount, children }: BalanceHalfProps) {
  const isLeft = side === 'left';
  return (
    <View
      style={[
        styles.halfShadow,
        isLeft ? styles.leftShadow : styles.rightShadow,
        isLeft ? styles.leftRadius : styles.rightRadius,
      ]}
    >
      <View style={[styles.halfClip, isLeft ? styles.leftRadius : styles.rightRadius]}>
        <LinearGradient
          colors={SHEEN_COLORS}
          locations={SHEEN_LOCATIONS}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.halfContent}>
          <GradientText style={styles.amount}>{`${amount} $`}</GradientText>
          {children}
        </View>
      </View>
    </View>
  );
}

function BalanceCardComponent({ balance }: BalanceCardProps) {
  return (
    <View style={styles.container}>
      <BalanceHalf side="left" amount={balance.cashBack}>
        <View style={styles.deltaRow}>
          <Text style={styles.cashBackLabel}>Cash Back</Text>
          <Text style={styles.cashBackLabel}>+{balance.cashBackDelta}$</Text>
        </View>
      </BalanceHalf>

      <BalanceHalf side="right" amount={balance.cashOut}>
        <Text style={styles.cashOutLabel}>Cash Out</Text>
      </BalanceHalf>
    </View>
  );
}

const CARD_RADIUS = 999;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.bgColor,
    borderRadius: CARD_RADIUS,
    padding: 4,
    gap: 2,
  },
  halfShadow: {
    flex: 1,
    backgroundColor: colors.white,
  },
  // Green-tinted glow under the Cash Back half.
  leftShadow: {
    shadowColor: '#00C10D',
    shadowOffset: { width: -5, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
  // Neutral drop shadow under the Cash Out half.
  rightShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 5,
  },
  leftRadius: {
    borderTopLeftRadius: CARD_RADIUS,
    borderBottomLeftRadius: CARD_RADIUS,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  rightRadius: {
    borderTopRightRadius: CARD_RADIUS,
    borderBottomRightRadius: CARD_RADIUS,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  halfClip: {
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  halfContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 2,
  },
  amount: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cashBackLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.mohajerGreen,
  },
  cashOutLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.labelSecondary,
  },
});

export const BalanceCard = memo(BalanceCardComponent);
