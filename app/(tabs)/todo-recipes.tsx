import { ThemedText } from '@/components/themed-text';
import Card from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { TodoRecipe, useApp } from '@/contexts/app-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TodoRecipesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { 
    todoRecipes, 
    removeRecipeFromTodo, 
    markRecipeAsDone 
  } = useApp();

  const markAsDone = (recipeId: string) => {
    const recipe = todoRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    Alert.alert(
      'Recette terminée ! 🎉',
      `Félicitations ! Vous avez cuisiné "${recipe.title}". Voulez-vous la retirer de votre liste ?`,
      [
        { text: 'Garder dans la liste', style: 'cancel' },
        { 
          text: 'Retirer de la liste', 
          style: 'default',
          onPress: () => markRecipeAsDone(recipeId)
        }
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile':
        return colors.success;
      case 'moyen':
        return colors.warning;
      case 'difficile':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const renderTodoRecipe = ({ item }: { item: TodoRecipe }) => (
    <Card style={styles.recipeCard}>
      <View style={styles.recipeContent}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.recipeImage}
            resizeMode="cover"
          />
        </View>

        {/* Informations */}
        <View style={styles.recipeInfo}>
          <ThemedText type="subtitle" style={styles.recipeTitle} numberOfLines={2}>
            {item.title}
          </ThemedText>
          
          <View style={styles.recipeDetails}>
            <View style={styles.detailItem}>
              <IconSymbol name="clock" size={14} color={colors.textLight} />
              <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>
                {item.cookTime}min
              </ThemedText>
            </View>
            
            <View style={styles.detailItem}>
              <IconSymbol name="chart.bar" size={14} color={getDifficultyColor(item.difficulty)} />
              <ThemedText style={[styles.detailText, { color: getDifficultyColor(item.difficulty) }]}>
                {item.difficulty}
              </ThemedText>
            </View>
            
            <View style={styles.detailItem}>
              <IconSymbol name="person.2" size={14} color={colors.textLight} />
              <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>
                {item.servings}
              </ThemedText>
            </View>
          </View>

          <ThemedText style={[styles.addedDate, { color: colors.textLight }]}>
            Ajouté {formatDate(item.addedAt)}
          </ThemedText>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.success }]}
            onPress={() => markAsDone(item.id)}
          >
            <IconSymbol name="checkmark" size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.error }]}
            onPress={() => removeRecipeFromTodo(item.id)}
          >
            <IconSymbol name="trash" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.backgroundWhite }]}>
        <View style={styles.headerContent}>
          <View>
            <ThemedText type="title">Recettes à faire</ThemedText>
            <ThemedText type="caption" style={{ color: colors.textSecondary }}>
              {todoRecipes.length === 0 
                ? 'Aucune recette planifiée' 
                : `${todoRecipes.length} recette(s) à cuisiner`
              }
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Liste des recettes */}
      <FlatList
        data={todoRecipes.sort((a, b) => {
          // Trier par date d'ajout (plus récent en premier)
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        })}
        renderItem={renderTodoRecipe}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="book.closed" size={48} color={colors.textLight} />
            <ThemedText type="subtitle" style={{ color: colors.textSecondary, textAlign: 'center' }}>
              Aucune recette planifiée
            </ThemedText>
            <ThemedText type="caption" style={{ color: colors.textLight, textAlign: 'center', marginBottom: Spacing.lg }}>
              Ajoutez des recettes depuis le catalogue en appuyant sur le bouton +
            </ThemedText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Spacing.md,
  },
  recipeCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  recipeContent: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  imageContainer: {
    position: 'relative',
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  recipeInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  recipeTitle: {
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  recipeDetails: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  detailText: {
    fontSize: FontSizes.xs,
  },
  addedDate: {
    fontSize: FontSizes.xs,
    fontStyle: 'italic',
  },
  actionsContainer: {
    gap: Spacing.sm,
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.md,
  },
  emptyButton: {
    minWidth: 200,
  },
});