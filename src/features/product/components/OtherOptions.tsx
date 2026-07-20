import { ChevronRightIcon } from '@/assets/icons/home';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { ProductCard } from '@/features/home';
import type { Product } from '@/features/home';
import { memo, useCallback } from 'react';
import { FlatList, type ListRenderItem, Pressable, StyleSheet, Text, View } from 'react-native';

interface OtherOptionsProps {
  products: Product[];
  onSeeMore?: () => void;
  onProductPress?: (product: Product) => void;
}

const CARD_GAP = 15;

function OtherOptionsComponent({ products, onSeeMore, onProductPress }: OtherOptionsProps) {
  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => <ProductCard product={item} onPress={onProductPress} />,
    [onProductPress],
  );

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Other Options"
        onPress={onSeeMore}
        style={styles.header}
      >
        <Text style={styles.title}>Other Options</Text>
        <ChevronRightIcon size={20} color={colors.blackText} />
      </Pressable>

      <FlatList
        horizontal
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={ListSeparator}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

function ListSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    lineHeight: 28,
    color: colors.blackText,
  },
  list: {
    // Keep chip shadows from being clipped by the horizontal list.
    overflow: 'visible',
  },
  listContent: {
    paddingBottom: 6,
  },
  separator: {
    width: CARD_GAP,
  },
});

export const OtherOptions = memo(OtherOptionsComponent);
