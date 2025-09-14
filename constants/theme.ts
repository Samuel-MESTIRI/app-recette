/**
 * Design system basé sur le UI kit fourni
 * Couleurs principales : Vert #4CAF50, arrière-plans clairs, design moderne
 */

import { Platform } from 'react-native';

// Couleurs du UI kit
const primaryGreen = '#4CAF50';
const primaryGreenDark = '#388E3C';
const primaryGreenLight = '#81C784';
const backgroundLight = '#F8F9FA';
const backgroundWhite = '#FFFFFF';
const textPrimary = '#1A1A1A';
const textSecondary = '#6B7280';
const textLight = '#9CA3AF';
const borderLight = '#E5E7EB';
const shadowColor = '#000000';

export const Colors = {
  light: {
    text: textPrimary,
    textSecondary: textSecondary,
    textLight: textLight,
    background: backgroundLight,
    backgroundWhite: backgroundWhite,
    tint: primaryGreen,
    primary: primaryGreen,
    primaryDark: primaryGreenDark,
    primaryLight: primaryGreenLight,
    border: borderLight,
    shadow: shadowColor,
    icon: textSecondary,
    tabIconDefault: textSecondary,
    tabIconSelected: primaryGreen,
    success: primaryGreen,
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textLight: '#808080',
    background: '#121212',
    backgroundWhite: '#1E1E1E',
    tint: primaryGreenLight,
    primary: primaryGreenLight,
    primaryDark: primaryGreen,
    primaryLight: '#A5D6A7',
    border: '#333333',
    shadow: '#000000',
    icon: '#B3B3B3',
    tabIconDefault: '#808080',
    tabIconSelected: primaryGreenLight,
    success: primaryGreenLight,
    warning: '#FFB74D',
    error: '#EF5350',
    info: '#42A5F5',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Tailles de police basées sur le UI kit
export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

// Espacements cohérents avec le design
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Rayons d'arrondis pour les composants
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Ombres pour les cards et composants
export const Shadows = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
