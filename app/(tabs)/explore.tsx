import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Card from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Input from '@/components/ui/input';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScrollView, StyleSheet } from 'react-native';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Explorer</ThemedText>
          <ThemedText type="caption" style={{ color: colors.textSecondary }}>
            Découvrez de nouvelles recettes délicieuses
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.searchSection}>
          <Input
            placeholder="Rechercher des recettes..."
            leftIcon={
              <IconSymbol 
                name="magnifyingglass" 
                size={20} 
                color={colors.textLight} 
              />
            }
            style={styles.searchInput}
          />
        </ThemedView>

        <ThemedView style={styles.content}>
          <ThemedView style={styles.categoriesSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Catégories populaires
            </ThemedText>
            <ThemedView style={styles.categoriesGrid}>
              <Card style={styles.categoryCard}>
                <ThemedText style={styles.categoryEmoji}>🍝</ThemedText>
                <ThemedText type="defaultSemiBold">Pâtes</ThemedText>
              </Card>
              <Card style={styles.categoryCard}>
                <ThemedText style={styles.categoryEmoji}>🥗</ThemedText>
                <ThemedText type="defaultSemiBold">Salades</ThemedText>
              </Card>
              <Card style={styles.categoryCard}>
                <ThemedText style={styles.categoryEmoji}>🍰</ThemedText>
                <ThemedText type="defaultSemiBold">Desserts</ThemedText>
              </Card>
              <Card style={styles.categoryCard}>
                <ThemedText style={styles.categoryEmoji}>🍲</ThemedText>
                <ThemedText type="defaultSemiBold">Plats</ThemedText>
              </Card>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.recipesSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Recettes tendances
            </ThemedText>
            <Card style={styles.placeholderCard}>
              <ThemedText style={{ color: colors.textSecondary, textAlign: 'center' }}>
                Les recettes apparaîtront ici une fois que vous en aurez ajouté
              </ThemedText>
            </Card>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  searchSection: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  searchInput: {
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xl,
  },
  categoriesSection: {
    gap: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  recipesSection: {
    gap: Spacing.md,
  },
  placeholderCard: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
});
