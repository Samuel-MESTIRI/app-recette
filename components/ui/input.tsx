import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  style,
  ...props
}: InputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const inputStyle = {
    backgroundColor: colors.backgroundWhite,
    borderWidth: 1,
    borderColor: error ? colors.error : colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSizes.base,
    color: colors.text,
    minHeight: 48,
  };

  return (
    <View style={[containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        <TextInput
          style={[
            inputStyle,
            leftIcon ? { paddingLeft: 44 } : {},
            rightIcon ? { paddingRight: 44 } : {},
            style,
          ]}
          placeholderTextColor={colors.textLight}
          {...props}
        />
        {rightIcon && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    position: 'relative',
  },
  leftIcon: {
    position: 'absolute',
    left: Spacing.sm,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: Spacing.sm,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  error: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
});