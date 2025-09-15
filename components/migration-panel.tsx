import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    addQuickTestData,
    addTestRecipe,
    checkFirebaseData,
    migrateDemoDataToFirebase
} from '@/utils/migration';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export default function MigrationPanel() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleQuickTest = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter des données');
      return;
    }

    setLoading(true);
    try {
      const success = await addQuickTestData(user.id);
      if (success) {
        Alert.alert('Succès', '✅ Données de test ajoutées !');
      } else {
        Alert.alert('Erreur', '❌ Échec de l\'ajout des données');
      }
    } catch (error) {
      Alert.alert('Erreur', `❌ ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSingleTest = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter des données');
      return;
    }

    setLoading(true);
    try {
      const success = await addTestRecipe(user.id);
      if (success) {
        Alert.alert('Succès', '✅ Recette de test ajoutée !');
      } else {
        Alert.alert('Erreur', '❌ Échec de l\'ajout de la recette');
      }
    } catch (error) {
      Alert.alert('Erreur', `❌ ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFullMigration = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour migrer les données');
      return;
    }

    Alert.alert(
      'Migration complète',
      'Cela va ajouter TOUTES les recettes de démo. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: async () => {
            setLoading(true);
            try {
              const success = await migrateDemoDataToFirebase(user.id);
              if (success) {
                Alert.alert('Succès', '✅ Migration complète terminée !');
              } else {
                Alert.alert('Erreur', '❌ Échec de la migration');
              }
            } catch (error) {
              Alert.alert('Erreur', `❌ ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleCheckData = async () => {
    setLoading(true);
    try {
      const hasData = await checkFirebaseData();
      Alert.alert(
        'État de la base de données', 
        hasData ? '✅ La base contient des données' : '📭 La base est vide'
      );
    } catch (error) {
      Alert.alert('Erreur', `❌ ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.warning}>
          👤 Connectez-vous pour utiliser les outils de migration
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        🛠️ Outils de Migration
      </ThemedText>
      
      <ThemedText style={styles.subtitle}>
        Utilisateur connecté : {user.name || user.email}
      </ThemedText>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleCheckData}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳' : '📊'} Vérifier la base
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.success }]}
          onPress={handleSingleTest}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳' : '🧪'} Ajouter 1 recette test
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.warning }]}
          onPress={handleQuickTest}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳' : '🚀'} Ajouter 2 recettes rapides
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.error }]}
          onPress={handleFullMigration}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳' : '📦'} Migration complète
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
    opacity: 0.7,
  },
  warning: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});