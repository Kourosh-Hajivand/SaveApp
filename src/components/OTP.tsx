import React, { useEffect, useMemo, useRef } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";

type OtpProps = {
  length: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
};

const normalizeDigits = (value: string) =>
  value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
    .replace(/[^0-9]/g, "");

export default function OTPCode({
  length,
  value,
  onChange,
  error,
  disabled,
  autoFocus = true,
}: OtpProps) {
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const chars = useMemo(() => {
    const digits = normalizeDigits(value || "");
    return Array.from({ length }, (_, index) => digits[index] ?? "");
  }, [value, length]);

  useEffect(() => {
    if (!autoFocus || disabled) return;
    const firstEmpty = chars.findIndex((char) => !char);
    const index = firstEmpty === -1 ? length - 1 : firstEmpty;
    inputsRef.current[index]?.focus();
  }, [autoFocus, disabled, chars, length]);

  const handleChange = (index: number, text: string) => {
    const cleaned = normalizeDigits(text);

    if (cleaned.length > 1) {
      const next = [...chars];
      for (let offset = 0; offset < cleaned.length && index + offset < length; offset += 1) {
        next[index + offset] = cleaned[offset];
      }
      onChange(next.join(""));
      inputsRef.current[Math.min(index + cleaned.length, length - 1)]?.focus();
      return;
    }

    const next = [...chars];
    next[index] = cleaned;
    onChange(next.join(""));
    if (cleaned && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const onKeyPress = (
    index: number,
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (event.nativeEvent.key === "Backspace" && !chars[index] && index > 0) {
      const next = [...chars];
      next[index - 1] = "";
      onChange(next.join(""));
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={`otp-${index}`}
          ref={(ref) => {
            inputsRef.current[index] = ref;
          }}
          value={chars[index]}
          editable={!disabled}
          keyboardType="number-pad"
          maxLength={length}
          onChangeText={(text) => handleChange(index, text)}
          onKeyPress={(event) => onKeyPress(index, event)}
          style={[
            styles.box,
            chars[index] ? styles.filled : null,
            error ? styles.error : null,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  box: {
    flex: 1,
    maxWidth: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#E9E9E9",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 22,
    color: "#28262E",
  },
  filled: {
    borderColor: "#1379DF",
  },
  error: {
    borderColor: "#C80404",
  },
});
