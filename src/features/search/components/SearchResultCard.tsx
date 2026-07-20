import StarIcon from '@/assets/icons/StarIcon';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { CashChip } from '@/features/home';
import type { Product } from '@/features/home';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SearchResultCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

function formatCount(count: number, unit: Product['countUnit']): string {
  return `(${count.toLocaleString('en-US')} ${unit})`;
}

function SearchResultCardComponent({ product, onPress }: SearchResultCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={product.title}
      onPress={() => onPress?.(product)}
      style={styles.card}
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
        <StarIcon size={13} color="#545454" />
        <Text style={styles.meta}>{product.rating.toFixed(1)}</Text>
        <Text style={styles.meta}>{formatCount(product.count, product.countUnit)}</Text>
      </View>

      <View style={styles.chips}>
        <CashChip
          kind="back"
          percent={product.cashBackPercent}
          highlighted={product.cashBackPercent >= 40}
        />
        <CashChip kind="out" percent={product.cashOutPercent} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    gap: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 382 / 215,
    borderRadius: 15,
    backgroundColor: colors.gray50,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.blackText,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.slate500,
  },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 2,
  },
});

export const SearchResultCard = memo(SearchResultCardComponent);
