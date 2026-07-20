import type { Product } from '@/features/home';
import { homeSections } from '@/features/home';
import { useMemo } from 'react';

/**
 * Flattened, de-duplicated catalog used as the search index. Products are
 * de-duplicated by title so the same place is not listed multiple times.
 * In production this list comes from the API; the shape is unchanged.
 */
const searchIndex: Product[] = (() => {
  const seenTitles = new Set<string>();
  const products: Product[] = [];

  for (const section of homeSections) {
    for (const product of section.products) {
      if (seenTitles.has(product.title)) {
        continue;
      }
      seenTitles.add(product.title);
      products.push(product);
    }
  }

  return products;
})();

/** Quick-pick suggestions shown while the query is empty. */
export const SEARCH_SUGGESTIONS = ['Breakfast', 'Beauty', 'Coffee', 'Florist', 'Teeth'] as const;

/**
 * Filters the catalog by a case-insensitive title match. An empty query
 * returns the full catalog so the screen can act as a browse list.
 */
export function useProductSearch(query: string): Product[] {
  return useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return searchIndex;
    }
    return searchIndex.filter((product) => product.title.toLowerCase().includes(normalized));
  }, [query]);
}
