import { spacing } from '@/styles/spaces';
import { colors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

interface OutlineButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export default function OutlineButton({
  children,
  style,
  disabled,
  ...props
}: OutlineButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled, style]}
      className="w-full flex-row items-center justify-center gap-2 rounded-full border border-system-gray6 py-[12px]"
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    borderWidth: 1,
    borderRadius: 999,
    borderColor: colors.system.gray6,
    width: '100%',
    paddingVertical: spacing['3'],
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
