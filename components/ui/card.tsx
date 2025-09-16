import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export default function Card({
  children,
  style,
  shadow = 'md',
  padding = 'md',
}: CardProps) {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.backgroundWhite,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
    };

    // Padding variants
    switch (padding) {
      case 'sm':
        baseStyle.padding = Spacing.sm;
        break;
      case 'lg':
        baseStyle.padding = Spacing.lg;
        break;
      case 'none':
        // Pas de padding
        break;
      default: // md
        baseStyle.padding = Spacing.md;
    }

    // Shadow variants
    if (shadow !== 'none') {
      const shadowStyle = Shadows[shadow];
      baseStyle.shadowColor = colors.shadow;
      baseStyle.shadowOffset = shadowStyle.shadowOffset;
      baseStyle.shadowOpacity = shadowStyle.shadowOpacity;
      baseStyle.shadowRadius = shadowStyle.shadowRadius;
      baseStyle.elevation = shadowStyle.elevation;
    }

    return baseStyle;
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
}