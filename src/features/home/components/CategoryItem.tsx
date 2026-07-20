import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Category } from '../types';

interface CategoryItemProps {
  category: Category;
  active?: boolean;
  onPress?: (categoryId: string) => void;
}

function CategoryItemComponent({ category, active = false, onPress }: CategoryItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={category.label}
      onPress={() => onPress?.(category.id)}
      style={styles.container}
    >
      <Image source={category.icon} style={styles.icon} contentFit="contain" />
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {category.label}
      </Text>
      <View style={[styles.dot, active && styles.dotActive]} />
    </Pressable>
  );
}

const DOT_SIZE = 5;

const styles = StyleSheet.create({
  container: {
    width: 70,
    alignItems: 'center',
    padding: 4,
    borderRadius: 10,
    gap: 2,
  },
  icon: {
    width: 54,
    height: 44,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.blackText,
  },
  labelInactive: {
    color: colors.labelSecondary,
  },
  // Always reserved so switching active items does not shift the row.
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: 'transparent',
    marginTop: 2,
  },
  dotActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 4,
    elevation: 3,
  },
});

export const CategoryItem = memo(CategoryItemComponent);
