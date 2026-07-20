import { SearchIcon } from '@/assets/icons/home';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onSubmit?: () => void;
  autoFocus?: boolean;
}

function SearchInputComponent({
  value,
  onChangeText,
  onClear,
  onSubmit,
  autoFocus = false,
}: SearchInputProps) {
  const hasValue = value.length > 0;

  return (
    <View style={styles.container}>
      <SearchIcon size={22} color={colors.blackText} />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder="Search food, stores, offers…"
        placeholderTextColor={colors.slate500}
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        allowFontScaling={false}
        clearButtonMode="never"
      />

      {hasValue ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={onClear}
          hitSlop={10}
          style={styles.clearButton}
        >
          <Text style={styles.clearGlyph}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.strokeColor,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.blackText,
  },
  clearButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.strokeColor,
  },
  clearGlyph: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.slate500,
  },
});

export const SearchInput = memo(SearchInputComponent);
