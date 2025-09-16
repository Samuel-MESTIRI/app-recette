import { Colors, FontSizes } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTheme } from '@/hooks/useTheme';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'caption' | 'heading';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'heading' ? styles.heading : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'link' ? [styles.link, { color: colors.primary }] : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: FontSizes.base,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: FontSizes.base,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: FontSizes['3xl'],
    fontWeight: '700',
    lineHeight: 36,
  },
  heading: {
    fontSize: FontSizes['2xl'],
    fontWeight: '600',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    lineHeight: 24,
  },
  caption: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  link: {
    lineHeight: 24,
    fontSize: FontSizes.base,
    fontWeight: '500',
  },
});
