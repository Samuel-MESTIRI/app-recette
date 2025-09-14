import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Mes Recettes</ThemedText>
          <ThemedText type="caption" style={{ color: colors.textSecondary }}>
            Découvrez et organisez vos recettes préférées
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          <Card style={styles.welcomeCard}>
            <ThemedText type="heading" style={styles.welcomeTitle}>
              Bienvenue ! 👋
            </ThemedText>
            <ThemedText style={[styles.welcomeText, { color: colors.textSecondary }]}>
              Commencez à créer votre collection de recettes personnalisée.
            </ThemedText>
            <Button
              title="Ajouter une recette"
              onPress={() => {
                // Navigation vers l'ajout de recette
              }}
              style={styles.addButton}
            />
          </Card>

          <ThemedView style={styles.statsSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Aperçu
            </ThemedText>
            <ThemedView style={styles.statsContainer}>
              <Card style={styles.statCard}>
                <ThemedText type="heading" style={{ color: colors.primary }}>
                  0
                </ThemedText>
                <ThemedText type="caption" style={{ color: colors.textSecondary }}>
                  Recettes
                </ThemedText>
              </Card>
              <Card style={styles.statCard}>
                <ThemedText type="heading" style={{ color: colors.primary }}>
                  0
                </ThemedText>
                <ThemedText type="caption" style={{ color: colors.textSecondary }}>
                  Favoris
                </ThemedText>
              </Card>
            </ThemedView>
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
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  welcomeCard: {
    padding: Spacing.lg,
  },
  welcomeTitle: {
    marginBottom: Spacing.sm,
  },
  welcomeText: {
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  addButton: {
    marginTop: Spacing.sm,
  },
  statsSection: {
    gap: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
  },
});
