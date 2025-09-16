import { BorderRadius, Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size variants
    switch (size) {
      case 'sm':
        baseStyle.paddingHorizontal = Spacing.md;
        baseStyle.paddingVertical = Spacing.sm;
        baseStyle.minHeight = 36;
        break;
      case 'lg':
        baseStyle.paddingHorizontal = Spacing.xl;
        baseStyle.paddingVertical = Spacing.md;
        baseStyle.minHeight = 56;
        break;
      default: // md
        baseStyle.paddingHorizontal = Spacing.lg;
        baseStyle.paddingVertical = Spacing.sm + 2;
        baseStyle.minHeight = 48;
    }

    // Color variants
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = colors.backgroundWhite;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.border;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.primary;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
      default: // primary
        baseStyle.backgroundColor = colors.primary;
        baseStyle.shadowColor = colors.shadow;
        baseStyle.shadowOffset = Shadows.sm.shadowOffset;
        baseStyle.shadowOpacity = Shadows.sm.shadowOpacity;
        baseStyle.shadowRadius = Shadows.sm.shadowRadius;
        baseStyle.elevation = Shadows.sm.elevation;
    }

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
    };

    // Size variants
    switch (size) {
      case 'sm':
        baseStyle.fontSize = FontSizes.sm;
        break;
      case 'lg':
        baseStyle.fontSize = FontSizes.lg;
        break;
      default: // md
        baseStyle.fontSize = FontSizes.base;
    }

    // Color variants
    switch (variant) {
      case 'secondary':
        baseStyle.color = colors.text;
        break;
      case 'outline':
        baseStyle.color = colors.primary;
        break;
      case 'ghost':
        baseStyle.color = colors.primary;
        break;
      default: // primary
        baseStyle.color = '#FFFFFF';
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
}