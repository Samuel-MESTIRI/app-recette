import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoadingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.logoText}>🍽️</ThemedText>
        </View>
        <ThemedText type="title" style={styles.title}>
          Mes Recettes
        </ThemedText>
        <ActivityIndicator 
          size="large" 
          color={colors.primary}
          style={styles.loader}
        />
        <ThemedText type="caption" style={[styles.loadingText, { color: colors.textSecondary }]}>
          Chargement en cours...
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 50,
  },
  title: {
    textAlign: 'center',
  },
  loader: {
    marginVertical: Spacing.md,
  },
  loadingText: {
    textAlign: 'center',
  },
});