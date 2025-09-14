import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Ajouter une recette</ThemedText>
      <ThemedView style={styles.content}>
        <ThemedText>Formulaire pour ajouter une nouvelle recette à venir...</ThemedText>
      </ThemedView>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Retour à l'accueil</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    marginVertical: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
