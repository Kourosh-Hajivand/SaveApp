import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { ChevronRightIcon, FlameIcon } from '@/assets/icons/home';
import { memo, useCallback } from 'react';
import { FlatList, type ListRenderItem, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Product, ProductSection as ProductSectionModel } from '../types';
import { ProductCard } from './ProductCard';

interface ProductSectionProps {
  section: ProductSectionModel;
  onSeeMore?: (sectionId: string) => void;
  onProductPress?: (product: Product) => void;
}

const CARD_GAP = 15;
const SECTION_PADDING = 28;

function ProductSectionComponent({ section, onSeeMore, onProductPress }: ProductSectionProps) {
  const { promoted = false, products, title, moreLabel } = section;

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => (
      <ProductCard product={item} promoted={promoted} onPress={onProductPress} />
    ),
    [promoted, onProductPress],
  );

  return (
    <View style={[styles.section, promoted && styles.promotedSection]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}${moreLabel ? `, ${moreLabel}` : ''}`}
        onPress={() => onSeeMore?.(section.id)}
        style={styles.header}
      >
        <View style={styles.titleGroup}>
          {promoted && <FlameIcon size={24} />}
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.headerRight}>
          {moreLabel ? <Text style={styles.moreLabel}>{moreLabel}</Text> : null}
          <ChevronRightIcon size={20} color={colors.blackText} />
        </View>
      </Pressable>

      <FlatList
        horizontal
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        ItemSeparatorComponent={ListSeparator}
      />
    </View>
  );
}

function ListSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  section: {
    gap: 15,
    paddingVertical: SECTION_PADDING,
  },
  promotedSection: {
    backgroundColor: colors.orange100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SECTION_PADDING,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    lineHeight: 28,
    color: colors.blackText,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moreLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.slate500,
  },
  list: {
    // Keep chip shadows from being clipped by the horizontal list.
    overflow: 'visible',
  },
  listContent: {
    paddingHorizontal: SECTION_PADDING,
    paddingBottom: 6,
  },
  separator: {
    width: CARD_GAP,
  },
});

export const ProductSection = memo(ProductSectionComponent);
