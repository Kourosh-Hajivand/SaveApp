import { Host, TextField, useNativeState } from "@expo/ui/swift-ui";
import { fixedSize, lineLimit } from "@expo/ui/swift-ui/modifiers";
import React, { useEffect } from "react";
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
} from "react-hook-form";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";

export type ControlledTextAreaProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  label: string;
  disabled?: boolean;
  numberOfLines?: number;
};

export default function ControlledTextArea<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  label,
  disabled,
  numberOfLines = 4,
}: ControlledTextAreaProps<TFieldValues>) {
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({ name, control, rules });

  const stringValue = typeof value === "string" ? value : "";
  const textState = useNativeState(stringValue);

  useEffect(() => {
    if (Platform.OS === "ios" && textState.value !== stringValue) {
      textState.set(stringValue);
    }
  }, [stringValue, textState]);

  if (Platform.OS === "ios") {
    return (
      <View style={[styles.container, disabled && styles.disabled]} pointerEvents={disabled ? "none" : "auto"}>
        <Text style={styles.label}>{label}</Text>
        <Host matchContents style={styles.host}>
          <TextField
            axis="vertical"
            placeholder={label}
            text={textState}
            onTextChange={onChange}
            onFocusChange={(focused) => {
              if (!focused) onBlur();
            }}
            modifiers={[
              lineLimit(numberOfLines),
              fixedSize({ horizontal: false, vertical: true }),
            ]}
          />
        </Host>
        {!!error?.message && <Text style={styles.error}>{String(error.message)}</Text>}
      </View>
    );
  }

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        editable={!disabled}
        value={stringValue}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder={label}
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        style={[styles.input, !!error && styles.inputError]}
      />
      {!!error?.message && <Text style={styles.error}>{String(error.message)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 6,
    marginVertical: 8,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    fontSize: 13,
    color: "#999999",
  },
  host: {
    width: "100%",
    minHeight: 96,
  },
  input: {
    width: "100%",
    minHeight: 96,
    borderWidth: 1,
    borderColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#28262E",
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#C80404",
  },
  error: {
    fontSize: 12,
    color: "#C80404",
  },
});
