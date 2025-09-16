import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useShopping } from '@/hooks/useShopping';
import { useTheme } from '@/hooks/useTheme';
import { Recipe } from '@/types';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface RecipeModalProps {
  recipe: Recipe | null;
  visible: boolean;
  onClose: () => void;
}

export default function RecipeModal({ recipe, visible, onClose }: RecipeModalProps) {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];
  const { addRecipeIngredients, loading: shoppingLoading } = useShopping();
  const [isAddingIngredients, setIsAddingIngredients] = useState(false);

  if (!recipe) return null;

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

  const formatIngredient = (ingredient: any) => {
    if (typeof ingredient === 'string') {
      // Ancien format (chaîne de caractères)
      return ingredient;
    }
    // Nouveau format (objet)
    let formatted = ingredient.name;
    if (ingredient.quantity && ingredient.unit) {
      formatted = `${ingredient.quantity}${ingredient.unit} de ${ingredient.name}`;
    } else if (ingredient.quantity) {
      formatted = `${ingredient.quantity} ${ingredient.name}`;
    }
    return formatted;
  };

  const formatInstruction = (instruction: any) => {
    if (typeof instruction === 'string') {
      // Ancien format (chaîne de caractères)
      return instruction;
    }
    // Nouveau format (objet)
    return instruction.description;
  };

  const handleAddToShoppingList = async () => {
    if (!recipe || isAddingIngredients) return;
    
    setIsAddingIngredients(true);
    try {
      await addRecipeIngredients(recipe.id || '', recipe.title, recipe.ingredients);
      Alert.alert(
        'Ajouté !',
        `Les ingrédients de "${recipe.title}" ont été ajoutés à votre liste de courses`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erreur lors de l\'ajout des ingrédients:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'ajout des ingrédients à la liste de courses',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAddingIngredients(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header avec bouton fermer */}
        <View style={[styles.header, { backgroundColor: colors.backgroundWhite, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>
            Détails de la recette
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image principale */}
          <Image 
            source={{ uri: recipe.image }} 
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Contenu principal */}
          <View style={styles.content}>
            {/* Titre et catégorie */}
            <View style={styles.titleSection}>
              <ThemedText type="title" style={styles.title}>
                {recipe.title}
              </ThemedText>
              <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                <ThemedText style={styles.categoryText}>
                  {recipe.category}
                </ThemedText>
              </View>
            </View>

            {/* Informations principales */}
            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <IconSymbol name="clock" size={20} color={colors.primary} />
                <ThemedText style={styles.infoLabel}>Temps</ThemedText>
                <ThemedText style={styles.infoValue}>{recipe.cookTime} min</ThemedText>
              </View>
              
              <View style={styles.infoCard}>
                <IconSymbol name="chart.bar" size={20} color={getDifficultyColor(recipe.difficulty)} />
                <ThemedText style={styles.infoLabel}>Difficulté</ThemedText>
                <ThemedText style={[styles.infoValue, { color: getDifficultyColor(recipe.difficulty) }]}>
                  {recipe.difficulty}
                </ThemedText>
              </View>
              
              <View style={styles.infoCard}>
                <IconSymbol name="person.2" size={20} color={colors.primary} />
                <ThemedText style={styles.infoLabel}>Portions</ThemedText>
                <ThemedText style={styles.infoValue}>{recipe.servings}</ThemedText>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Description
              </ThemedText>
              <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
                Une délicieuse recette de {recipe.title.toLowerCase()} qui ravira vos papilles. 
                Parfaite pour un repas en famille ou entre amis, cette recette allie tradition et saveur.
              </ThemedText>
            </View>

            {/* Ingrédients */}
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Ingrédients
              </ThemedText>
              {recipe.ingredients?.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
                  <ThemedText style={[styles.ingredientText, { color: colors.textSecondary }]}>
                    {formatIngredient(ingredient)}
                  </ThemedText>
                </View>
              ))}
            </View>

            {/* Étapes */}
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Préparation
              </ThemedText>
              {recipe.instructions?.map((instruction, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                    <ThemedText style={styles.stepNumberText}>
                      {index + 1}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.stepText, { color: colors.textSecondary }]}>
                    {formatInstruction(instruction)}
                  </ThemedText>
                </View>
              ))}
            </View>

            {/* Bouton pour ajouter à la liste de courses */}
            <TouchableOpacity 
              style={[styles.shoppingButton, { 
                backgroundColor: colors.primary,
                opacity: isAddingIngredients ? 0.6 : 1 
              }]}
              onPress={handleAddToShoppingList}
              disabled={isAddingIngredients}
              activeOpacity={0.8}
            >
              <IconSymbol 
                name={isAddingIngredients ? "clock" : "plus"} 
                size={18} 
                color="white" 
              />
              <ThemedText style={styles.shoppingButtonText}>
                {isAddingIngredients ? 'Ajout en cours...' : 'Ajouter à ma liste de courses'}
              </ThemedText>
            </TouchableOpacity>

            {/* Espacement bottom */}
            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  heroImage: {
    width: width,
    height: 250,
  },
  content: {
    padding: Spacing.md,
  },
  titleSection: {
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.sm,
    lineHeight: 32,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    color: 'white',
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    marginHorizontal: Spacing.xs / 2,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F8F9FA',
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs / 2,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  description: {
    lineHeight: 22,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.sm,
  },
  ingredientText: {
    flex: 1,
    lineHeight: 20,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: FontSizes.xs,
    color: 'white',
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    lineHeight: 22,
  },
  shoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: Spacing.sm,
  },
  shoppingButtonText: {
    color: 'white',
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});