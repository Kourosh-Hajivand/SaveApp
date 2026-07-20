import StarIcon from '@/assets/icons/StarIcon';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Product } from '../types';
import { CashChip } from './CashChip';

export const PRODUCT_CARD_WIDTH = 250;

interface ProductCardProps {
  product: Product;
  /** Promoted cards sit on a white rounded surface with an emphasised chip. */
  promoted?: boolean;
  onPress?: (product: Product) => void;
}

function formatCount(count: number, unit: Product['countUnit']): string {
  return `(${count.toLocaleString('en-US')} ${unit})`;
}

function ProductCardComponent({ product, promoted = false, onPress }: ProductCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={product.title}
      onPress={() => onPress?.(product)}
      style={[styles.container, promoted && styles.promotedContainer]}
    >
      <Image
        source={product.image}
        style={styles.image}
        contentFit="cover"
        transition={150}
      />

      <Text style={styles.title} numberOfLines={2}>
        {product.title}
      </Text>

      <View style={styles.ratingRow}>
        <StarIcon size={11} color="#545454" />
        <Text style={styles.metaText}>{product.rating.toFixed(1)}</Text>
        <Text style={styles.metaText}>{formatCount(product.count, product.countUnit)}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsRow}
      >
        <CashChip
          kind="back"
          percent={product.cashBackPercent}
          highlighted={promoted || product.cashBackPercent >= 40}
        />
        <CashChip kind="out" percent={product.cashOutPercent} />
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: PRODUCT_CARD_WIDTH,
    gap: 8,
    overflow: 'visible',
  },
  promotedContainer: {
    backgroundColor: colors.white,
    borderRadius: 27,
    padding: 12,
    gap: 16,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 15,
    backgroundColor: colors.gray50,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.blackText,
    minHeight: 40,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.slate500,
  },
  chipsScroll: {
    // Do not clip overflowing tags — keep them scrollable and fully visible.
    overflow: 'visible',
    flexGrow: 0,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 6,
    paddingBottom: 8,
    paddingRight: 4,
  },
});

export const ProductCard = memo(ProductCardComponent);
