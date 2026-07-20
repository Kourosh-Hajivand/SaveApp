import { FlameIcon } from '@/assets/icons/home';
import { GradientText } from '@/components/text/GradientText';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { CashbackOffer } from '../types';

interface CashbackSummaryProps {
  cashBackPercent: number;
  cashOutPercent: number;
  /** When set, the cash-back half is emphasised and an offer banner is shown. */
  offer?: CashbackOffer;
}

const SHEEN_NEUTRAL = ['rgba(255,255,255,0)', 'rgba(191,191,191,0.3)'] as const;
const SHEEN_WARM = ['rgba(255,255,255,0)', 'rgba(255,165,82,0.3)'] as const;
const SHEEN_LOCATIONS = [0.24, 1] as const;

const VALUE_GRADIENT_DARK = ['#666666', '#7B7B7B', '#000000'] as const;
const VALUE_GRADIENT_WARM = ['#666666', '#7B7B7B', '#ED6F34'] as const;
const VALUE_GRADIENT_LOCATIONS = [0.2, 0.48, 0.75] as const;

const OFFER_BG = '#FF9500';

function CashbackSummaryComponent({ cashBackPercent, cashOutPercent, offer }: CashbackSummaryProps) {
  const promoted = Boolean(offer);

  return (
    <View style={styles.wrapper}>
      <View style={styles.pill}>
        <View
          style={[
            styles.half,
            styles.leftRadius,
            promoted ? styles.warmShadow : styles.neutralShadow,
          ]}
        >
          <View style={[styles.halfClip, styles.leftRadius]}>
            <LinearGradient
              colors={promoted ? SHEEN_WARM : SHEEN_NEUTRAL}
              locations={SHEEN_LOCATIONS}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.halfContent}>
              <View style={styles.valueRow}>
                {promoted ? <FlameIcon size={24} /> : null}
                <GradientText
                  style={styles.value}
                  colors={promoted ? VALUE_GRADIENT_WARM : VALUE_GRADIENT_DARK}
                  locations={VALUE_GRADIENT_LOCATIONS}
                >
                  {`${cashBackPercent}%`}
                </GradientText>
              </View>
              <Text style={styles.label}>Cash Back</Text>
            </View>
          </View>
        </View>

        <View style={[styles.half, styles.rightRadius, styles.neutralShadow]}>
          <View style={[styles.halfClip, styles.rightRadius]}>
            <LinearGradient
              colors={SHEEN_NEUTRAL}
              locations={SHEEN_LOCATIONS}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.halfContent}>
              <GradientText
                style={styles.value}
                colors={VALUE_GRADIENT_DARK}
                locations={VALUE_GRADIENT_LOCATIONS}
              >
                {`${cashOutPercent}%`}
              </GradientText>
              <Text style={styles.label}>Cash Out</Text>
            </View>
          </View>
        </View>
      </View>

      {offer ? (
        <View style={styles.offerBanner}>
          <Text style={styles.offerText}>{`${cashBackPercent} % Cash Back`}</Text>
          <Text style={styles.offerText}>Offer Ends in:</Text>
          <Text style={styles.offerStrong}>{offer.endsInLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 10,
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: colors.bgColor,
    borderRadius: 999,
    padding: 4,
    gap: 2,
  },
  half: {
    flex: 1,
    backgroundColor: colors.white,
  },
  neutralShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 4,
  },
  warmShadow: {
    shadowColor: '#C14A00',
    shadowOffset: { width: -5, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
  },
  leftRadius: {
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  rightRadius: {
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  halfClip: {
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  halfContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.labelSecondary,
    textAlign: 'center',
  },
  offerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: OFFER_BG,
    borderRadius: 1000,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  offerText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.white,
  },
  offerStrong: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.blackText,
  },
});

export const CashbackSummary = memo(CashbackSummaryComponent);
