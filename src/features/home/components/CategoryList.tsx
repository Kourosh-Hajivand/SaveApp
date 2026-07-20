import { memo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { Category } from '../types';
import { CategoryItem } from './CategoryItem';

interface CategoryListProps {
  categories: Category[];
  activeCategoryId: string;
  onSelect?: (categoryId: string) => void;
}

function CategoryListComponent({ categories, activeCategoryId, onSelect }: CategoryListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          active={category.id === activeCategoryId}
          onPress={onSelect}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 8,
  },
});

export const CategoryList = memo(CategoryListComponent);
