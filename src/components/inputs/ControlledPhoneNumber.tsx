import { BaseText } from '@/components/text/BaseText';
import countryList from '@/models/countryData.json';
import { spacing } from '@/styles/spaces';
import { colors } from '@/theme/colors';
import { BottomSheet, Group, Host, RNHostView } from '@expo/ui/swift-ui';
import {
  presentationBackground,
  presentationDetents,
  presentationDragIndicator,
} from '@expo/ui/swift-ui/modifiers';
import React, { useDeferredValue, useMemo, useRef, useState } from 'react';
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
} from 'react-hook-form';
import {
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

type Country = {
  country: string;
  prefix: string;
  flag?: string;
  regex?: string;
};

type ControlledPhoneNumberProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  size?: 'Default' | 'Large';
};

const INPUT_HEIGHT = {
  Large: 50,
  Default: 44,
} as const;

const COUNTRIES = countryList as Country[];

const normalizeDigits = (s: string) =>
  s
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[^0-9]/g, '');

const parsePhoneValue = (raw: unknown, fallback: Country) => {
  const v = typeof raw === 'string' ? raw : '';
  // Prefer longer prefixes first so +966 wins over +9x collisions if added later.
  const sorted = [...COUNTRIES].sort((a, b) => b.prefix.length - a.prefix.length);
  const found = sorted.find((c) => v.startsWith(`+${c.prefix}`));
  if (found) {
    return {
      country: found,
      prefix: found.prefix,
      phone: normalizeDigits(v.replace(`+${found.prefix}`, '')),
    };
  }
  return {
    country: fallback,
    prefix: fallback.prefix,
    phone: '',
  };
};

export default function ControlledPhoneNumber<T extends FieldValues>({
  name,
  control,
  rules,
  label,
  disabled = false,
  maxLength = 15,
  size = 'Large',
}: ControlledPhoneNumberProps<T>) {
  const height = INPUT_HEIGHT[size];

  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({ name, control, rules });

  const defaultCountry = COUNTRIES[0];
  const parsed = useMemo(
    () => parsePhoneValue(value, defaultCountry),
    [value, defaultCountry],
  );

  const [selectedCountry, setSelectedCountry] = useState<Country>(parsed.country);
  const [prefix, setPrefix] = useState(parsed.prefix);
  const [phone, setPhone] = useState(parsed.phone);
  const [syncedValue, setSyncedValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [isSheetPresented, setIsSheetPresented] = useState(false);

  if (value !== syncedValue) {
    setSyncedValue(value);
    setSelectedCountry(parsed.country);
    setPrefix(parsed.prefix);
    setPhone(parsed.phone);
  }

  const emitChange = (nextPrefix: string, nextPhone: string) => {
    onChange(`+${nextPrefix}${nextPhone}`);
  };

  const inputRef = useRef<TextInput>(null);

  const openSheet = () => {
    if (disabled) return;
    Keyboard.dismiss();
    setIsSheetPresented(true);
  };

  const handleCountryPick = (country: Country) => {
    setSelectedCountry(country);
    setPrefix(country.prefix);
    emitChange(country.prefix, phone);
    setIsSheetPresented(false);
  };

  const handlePhoneChange = (text: string) => {
    const nextPhone = normalizeDigits(text).slice(0, maxLength);
    setPhone(nextPhone);
    emitChange(prefix, nextPhone);
  };

  const deferredPhone = useDeferredValue(phone);
  const phoneErr = useMemo(() => {
    if (!deferredPhone || !selectedCountry?.regex) return null;
    try {
      const reg = new RegExp(selectedCountry.regex);
      const full = `+${prefix}${deferredPhone}`;
      return reg.test(full) ? null : 'Invalid phone number';
    } catch {
      return null;
    }
  }, [deferredPhone, selectedCountry, prefix]);

  const displayError = error?.message ?? phoneErr;
  const hasError = Boolean(displayError);

  const borderColor = hasError
    ? colors.system.red
    : isFocused
      ? colors.primary[500]
      : colors.border;

  const animatedRingStyle = useAnimatedStyle(() => {
    const scale = withSpring(isFocused ? 1.05 : 1);
    const opacity = withTiming(isFocused ? 1 : 0);
    return { transform: [{ scale }], opacity };
  });

  const focusInput = () => {
    if (!disabled) inputRef.current?.focus();
  };

  const renderCountryItem = ({ item }: { item: Country }) => {
    // Compare by country name so shared dial codes (+1 CA/US) stay unique.
    const isActive = item.country === selectedCountry.country;

    return (
      <Pressable
        onPress={() => handleCountryPick(item)}
        style={[styles.countryRow, isActive && styles.countryRowActive]}
      >
        <View style={styles.countryInfo}>
          <Text style={styles.countryFlag}>{item.flag ?? ''}</Text>
          <View>
            <BaseText type="Body" weight="400">
              {item.country}
            </BaseText>
            <BaseText type="Caption1" color="text-secondary" weight="300">
              {`+${item.prefix}`}
            </BaseText>
          </View>
        </View>
        {isActive ? (
          <BaseText type="Caption1" color="system.blue" weight="500">
            ✓
          </BaseText>
        ) : null}
      </Pressable>
    );
  };

  const countryListContent = (
    <View style={styles.sheetBody}>
      <View style={styles.sheetHeader}>
        <BaseText type="Headline" weight="500">
          Select Country
        </BaseText>
      </View>
      <FlatList
        data={COUNTRIES}
        keyExtractor={(item) => item.country}
        renderItem={renderCountryItem}
        contentContainerStyle={styles.sheetContent}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );

  return (
    <>
      <View style={[styles.container, disabled && styles.disabled]}>
        <View style={styles.row}>
          <TouchableOpacity
            disabled={disabled}
            onPress={openSheet}
            activeOpacity={0.8}
            style={[
              styles.prefixBox,
              {
                height,
                borderColor: hasError ? colors.system.red : colors.border,
              },
            ]}
          >
            <Text style={styles.flag}>{selectedCountry?.flag ?? ''}</Text>
            <BaseText type="Body" color="text" weight="400">
              {`+${prefix}`}
            </BaseText>
            <Text style={styles.chevron}>▾</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Animated.View
              style={[
                styles.ring,
                {
                  backgroundColor: hasError
                    ? colors.system.red + '26'
                    : colors.primary[500] + '26',
                },
                animatedRingStyle,
              ]}
            />

            <TouchableOpacity
              onPress={focusInput}
              disabled={disabled}
              activeOpacity={0.8}
              style={[
                styles.input,
                {
                  height,
                  borderColor,
                  backgroundColor: colors.system.white,
                },
              ]}
            >
              {!phone && !!label && (
                <View style={styles.placeholder}>
                  <BaseText type="Body" color="text-secondary">
                    {label}
                  </BaseText>
                </View>
              )}

              <TextInput
                ref={inputRef}
                editable={!disabled}
                keyboardType="number-pad"
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false);
                  onBlur();
                }}
                value={phone}
                onChangeText={handlePhoneChange}
                placeholder=""
                placeholderTextColor="rgba(60, 60, 67, 0.30)"
                maxLength={maxLength}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.errorContainer}>
          {!!displayError && (
            <BaseText color="system.red" type="Caption2">
              {String(displayError)}
            </BaseText>
          )}
        </View>
      </View>

      {Platform.OS === 'ios' ? (
        <Host
          style={styles.sheetHost}
          pointerEvents={isSheetPresented ? 'auto' : 'none'}
        >
          <BottomSheet
            isPresented={isSheetPresented}
            onIsPresentedChange={setIsSheetPresented}
          >
            <Group
              modifiers={[
                presentationDetents(['medium', 'large']),
                presentationDragIndicator('visible'),
                presentationBackground('#ffffff'),
              ]}
            >
              <RNHostView>{countryListContent}</RNHostView>
            </Group>
          </BottomSheet>
        </Host>
      ) : (
        <Modal
          visible={isSheetPresented}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsSheetPresented(false)}
        >
          {countryListContent}
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing['1'],
  },
  disabled: {
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  prefixBox: {
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['1'],
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: colors.system.white,
    paddingHorizontal: spacing['2'],
  },
  flag: {
    fontSize: 18,
  },
  chevron: {
    fontSize: 14,
    color: colors['text-secondary'],
  },
  inputContainer: {
    flex: 1,
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    left: '1.5%',
    top: '-2.5%',
    width: '97%',
    height: '106%',
    borderRadius: 13,
  },
  input: {
    width: '100%',
    paddingHorizontal: spacing['4'],
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  placeholder: {
    position: 'absolute',
    left: spacing['4'],
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400',
    paddingVertical: 0,
    textAlignVertical: 'center',
    paddingBottom: 3,
  },
  errorContainer: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
    paddingHorizontal: spacing['1'],
  },
  sheetHost: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },
  sheetBody: {
    flex: 1,
    backgroundColor: colors.system.white,
  },
  sheetHeader: {
    paddingHorizontal: spacing['5'],
    paddingTop: spacing['6'],
    paddingBottom: spacing['4'],
  },
  sheetContent: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['8'],
    gap: spacing['2'],
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['3'],
    backgroundColor: colors.system.white,
  },
  countryRowActive: {
    backgroundColor: colors.primary[50],
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  countryFlag: {
    fontSize: 20,
  },
});
