import {
  Host,
  SecureField,
  TextField,
  useNativeState,
} from "@expo/ui/swift-ui";
import { keyboardType as keyboardTypeModifier } from "@expo/ui/swift-ui/modifiers";
import React, { useEffect } from "react";
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
} from "react-hook-form";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from "react-native";

type InputType = "text" | "password" | "number" | "email" | "phone";

export type ControlledInputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  label: string;
  type?: InputType;
  disabled?: boolean;
};

function resolveKeyboardType(type: InputType): KeyboardTypeOptions {
  if (type === "number") return "numeric";
  if (type === "email") return "email-address";
  if (type === "phone") return "phone-pad";
  return "default";
}

function SwiftControlledField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  label,
  type = "text",
  disabled,
}: ControlledInputProps<TFieldValues>) {
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({ name, control, rules });

  const stringValue = typeof value === "string" ? value : "";
  const textState = useNativeState(stringValue);

  useEffect(() => {
    if (textState.value !== stringValue) {
      textState.set(stringValue);
    }
  }, [stringValue, textState]);

  const handleTextChange = (nextValue: string) => {
    onChange(nextValue);
  };

  const handleFocusChange = (focused: boolean) => {
    if (!focused) onBlur();
  };

  const keyboardModifiers =
    type === "email"
      ? [keyboardTypeModifier("email-address")]
      : type === "phone"
        ? [keyboardTypeModifier("phone-pad")]
        : type === "number"
          ? [keyboardTypeModifier("numeric")]
          : [];

  return (
    <View style={[styles.container, disabled && styles.disabled]} pointerEvents={disabled ? "none" : "auto"}>
      <Text style={styles.label}>{label}</Text>
      <Host matchContents style={styles.host}>
        {type === "password" ? (
          <SecureField
            placeholder={label}
            text={textState}
            onTextChange={handleTextChange}
            onFocusChange={handleFocusChange}
          />
        ) : (
          <TextField
            placeholder={label}
            text={textState}
            onTextChange={handleTextChange}
            onFocusChange={handleFocusChange}
            modifiers={keyboardModifiers}
          />
        )}
      </Host>
      {!!error?.message && <Text style={styles.error}>{String(error.message)}</Text>}
    </View>
  );
}

function RnControlledField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  label,
  type = "text",
  disabled,
}: ControlledInputProps<TFieldValues>) {
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        editable={!disabled}
        value={typeof value === "string" ? value : ""}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder={label}
        secureTextEntry={type === "password"}
        keyboardType={resolveKeyboardType(type)}
        autoCapitalize={type === "email" || type === "phone" ? "none" : "sentences"}
        style={[styles.input, !!error && styles.inputError]}
      />
      {!!error?.message && <Text style={styles.error}>{String(error.message)}</Text>}
    </View>
  );
}

export default function ControlledInput<TFieldValues extends FieldValues>(
  props: ControlledInputProps<TFieldValues>,
) {
  if (Platform.OS === "ios") {
    return <SwiftControlledField {...props} />;
  }
  return <RnControlledField {...props} />;
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
    minHeight: 44,
  },
  input: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 14,
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
