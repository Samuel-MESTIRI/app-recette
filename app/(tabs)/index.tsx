import RecipeCard from '@/components/recipe-card';
import RecipeModal from '@/components/recipe-modal';
import { ThemedText } from '@/components/themed-text';
import { showErrorAlert, useCustomAlert } from '@/components/ui';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RECIPE_CATEGORIES } from '@/constants/demo-recipes';
import { Colors, Spacing } from '@/constants/theme';
import { useApp } from '@/contexts/app-context';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRecipes } from '@/hooks/useRecipes';
import { useShopping } from '@/hooks/useShopping';
import { Recipe } from '@/types';
import { checkFirebaseData, migrateDemoDataToFirebase } from '@/utils/migration';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const { addRecipeToTodo } = useApp();
  const { addRecipeIngredients } = useShopping();
  const { recipes: firebaseRecipes, loading, error, refetch } = useRecipes();
  const { showAlert, AlertComponent } = useCustomAlert();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser Firebase avec les données de démo si nécessaire
  useEffect(() => {
    const initializeFirebase = async () => {
      // ⚠️ IMPORTANT: Ne pas essayer d'accéder à Firestore si pas connecté
      if (!user) {
        console.log('👤 Utilisateur non connecté - pas d\'accès à Firestore');
        setIsInitialized(true);
        return;
      }

      try {
        const hasData = await checkFirebaseData();
        if (!hasData) {
          console.log('📝 Première utilisation - migration des données de démo...');
          await migrateDemoDataToFirebase();
          await refetch(); // Recharger les données après migration
          console.log('✅ Migration terminée !');
        } else {
          console.log('📊 Données Firebase déjà présentes, pas de migration nécessaire');
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        setIsInitialized(true); // Continuer même en cas d'erreur
      }
    };

    if (!isInitialized) {
      initializeFirebase();
    }
  }, [refetch, isInitialized, user]); // Ajout de user comme dépendance

  // Filtrer les recettes
  const filteredRecipes = useMemo(() => {
    let recipes = firebaseRecipes.map(recipe => ({
      ...recipe,
      isFavorite: favorites.includes(recipe.id || '')
    }));

    // Filtrer par recherche
    if (searchQuery.trim()) {
      recipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.description && recipe.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (recipe.category && recipe.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filtrer par catégorie
    if (selectedCategory !== 'Tous') {
      recipes = recipes.filter(recipe => recipe.category === selectedCategory);
    }

    return recipes;
  }, [firebaseRecipes, searchQuery, selectedCategory, favorites]);

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  };

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  const handleAddToTodo = async (recipe: Recipe) => {
    const success = addRecipeToTodo(recipe);
    
    if (success) {
      try {
        // Ajouter aussi les ingrédients à la liste de courses
        await addRecipeIngredients(recipe.id || '', recipe.title, recipe.ingredients);
        // Pas d'alert de succès - l'ajout se fait silencieusement
      } catch (error) {
        console.error('Erreur lors de l\'ajout des ingrédients:', error);
        showErrorAlert(
          showAlert,
          'Partiellement ajouté',
          `"${recipe.title}" a été ajouté à vos recettes à faire, mais il y a eu une erreur lors de l'ajout des ingrédients à la liste de courses`
        );
      }
    } else {
      showAlert({
        type: 'info',
        title: 'Déjà ajouté',
        message: `"${recipe.title}" est déjà dans votre liste de recettes à faire`,
      });
    }
  };

  const renderRecipeItem = ({ item, index }: { item: Recipe; index: number }) => (
    <View style={[
      styles.recipeItem,
      { marginLeft: index % 2 === 0 ? 0 : Spacing.sm } // Espacement réduit pour cartes plus larges
    ]}>
      <RecipeCard
        recipe={item}
        onPress={() => handleRecipePress(item)}
        onFavoritePress={() => toggleFavorite(item.id || '')}
        onAddToTodo={() => handleAddToTodo(item)}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Chargement initial */}
      {loading && !isInitialized && (
        <View style={styles.loadingContainer}>
          <ThemedText type="subtitle" style={{ color: colors.textSecondary, textAlign: 'center' }}>
            🔥 Initialisation de Firebase...
          </ThemedText>
        </View>
      )}

      {/* Erreur */}
      {error && (
        <View style={styles.errorContainer}>
          <ThemedText type="subtitle" style={{ color: colors.error, textAlign: 'center' }}>
            ⚠️ {error}
          </ThemedText>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={refetch}
          >
            <ThemedText style={{ color: 'white' }}>Réessayer</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Contenu principal */}
      {isInitialized && !error && (
        <>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.backgroundWhite }]}>
            <View style={styles.headerContent}>
              <View>
                <ThemedText type="title">Catalogue</ThemedText>
            <ThemedText type="caption" style={{ color: colors.textSecondary }}>
              Découvrez {firebaseRecipes.length} recettes délicieuses
            </ThemedText>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <ThemedText type="caption" style={{ color: colors.primary, fontWeight: '600' }}>
                {favorites.length}
              </ThemedText>
              <ThemedText type="caption" style={{ color: colors.textLight }}>
                Favoris
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Barre de recherche */}
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textLight} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher une recette..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtres de catégories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {RECIPE_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: selectedCategory === category 
                    ? colors.primary 
                    : colors.background,
                  borderColor: colors.border,
                }
              ]}
            >
              <ThemedText
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category 
                      ? 'white' 
                      : colors.textSecondary,
                    fontWeight: selectedCategory === category ? '600' : '400'
                  }
                ]}
              >
                {category}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Liste des recettes */}
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id || ''}
        numColumns={2}
        contentContainerStyle={styles.recipesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="magnifyingglass" size={48} color={colors.textLight} />
            <ThemedText type="subtitle" style={{ color: colors.textSecondary, textAlign: 'center' }}>
              Aucune recette trouvée
            </ThemedText>
            <ThemedText type="caption" style={{ color: colors.textLight, textAlign: 'center' }}>
              Essayez de modifier vos critères de recherche
            </ThemedText>
          </View>
        }
      />

      {/* Modal de détails de recette */}
      <RecipeModal
        recipe={selectedRecipe}
        visible={modalVisible}
        onClose={closeModal}
      />

      {/* Custom Alert Component */}
      {AlertComponent}
        </>
      )}
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
    marginBottom: Spacing.lg,
  },
  headerStats: {
    alignItems: 'flex-end',
  },
  statItem: {
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.xs,
  },
  categoriesContainer: {
    marginBottom: Spacing.sm,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
  },
  recipesList: {
    padding: Spacing.md,
  },
  recipeItem: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  retryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
});
