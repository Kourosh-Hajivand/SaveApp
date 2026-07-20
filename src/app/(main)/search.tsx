import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import type { Product } from '@/features/home';
import {
  SEARCH_SUGGESTIONS,
  SearchInput,
  SearchResultCard,
  useProductSearch,
} from '@/features/search';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useDeferredValue, useState } from 'react';
import {
  FlatList,
  type ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SearchRoute() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const results = useProductSearch(deferredQuery);

  const trimmedQuery = deferredQuery.trim();
  const hasQuery = trimmedQuery.length > 0;
  const isEmpty = hasQuery && results.length === 0;

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(main)');
  }, [router]);

  const handleClear = useCallback(() => setQuery(''), []);

  const handleProductPress = useCallback(
    (product: Product) => {
      router.push({
        pathname: '/(main)/product/[id]',
        params: { id: product.id, promoted: product.cashBackPercent >= 40 ? '1' : '0' },
      });
    },
    [router],
  );

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => <SearchResultCard product={item} onPress={handleProductPress} />,
    [handleProductPress],
  );

  const listHeader = hasQuery ? (
    <View style={styles.resultHeader}>
      <Text style={styles.resultTitle} numberOfLines={1}>
        {`Result for ${trimmedQuery}`}
      </Text>
      <Text style={styles.resultCount}>
        {`${results.length} ${results.length === 1 ? 'result' : 'results'}`}
      </Text>
    </View>
  ) : (
    <View style={styles.suggestionsBlock}>
      <Text style={styles.sectionLabel}>Popular searches</Text>
      <View style={styles.suggestionRow}>
        {SEARCH_SUGGESTIONS.map((suggestion) => (
          <Pressable
            key={suggestion}
            accessibilityRole="button"
            accessibilityLabel={`Search ${suggestion}`}
            onPress={() => setQuery(suggestion)}
            style={styles.suggestionChip}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.sectionLabel}>Browse all</Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Search',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTitleStyle: { fontFamily: fonts.semiBold, fontSize: 18, color: colors.blackText },
          headerStyle: { backgroundColor: colors.white },
        }}
      />

      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon="chevron.left"
          tintColor={colors.blackText}
          accessibilityLabel="Go back"
          onPress={handleBack}
        />
      </Stack.Toolbar>

      <View style={styles.searchBarWrap}>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          onClear={handleClear}
          autoFocus
        />
      </View>

      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          isEmpty ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>{`We couldn't find anything for "${trimmedQuery}".`}</Text>
            </View>
          ) : null
        }
        ItemSeparatorComponent={ListSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </View>
  );
}

function ListSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchBarWrap: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    zIndex: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  listContent: {
    padding: 24,
  },
  separator: {
    height: 24,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  resultTitle: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 18,
    lineHeight: 28,
    color: colors.blackText,
  },
  resultCount: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.slate500,
    marginLeft: 12,
  },
  suggestionsBlock: {
    gap: 12,
    marginBottom: 24,
  },
  sectionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    lineHeight: 28,
    color: colors.blackText,
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.strokeColor,
  },
  suggestionText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.blackText,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.blackText,
  },
  emptySubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.slate500,
    textAlign: 'center',
  },
});
