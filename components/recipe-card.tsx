import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Recipe } from '@/types';
import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - (Spacing.lg * 3)) / 2; // 2 colonnes avec espacement

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
  onFavoritePress?: () => void;
  onAddToTodo?: () => void;
}

export default function RecipeCard({ recipe, onPress, onFavoritePress, onAddToTodo }: RecipeCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.container} padding="none">
        {/* Image avec bouton favori */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: recipe.image }} 
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={[styles.favoriteButton, { backgroundColor: colors.backgroundWhite }]}
            onPress={onFavoritePress}
            activeOpacity={0.8}
          >
            <IconSymbol 
              name={recipe.isFavorite ? "heart.fill" : "heart"} 
              size={16} 
              color={recipe.isFavorite ? colors.error : colors.textLight} 
            />
          </TouchableOpacity>
          
          {/* Badge catégorie */}
          <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
            <ThemedText style={styles.categoryText}>
              {recipe.category}
            </ThemedText>
          </View>
        </View>

        {/* Contenu */}
        <View style={styles.content}>
          {/* Titre */}
          <ThemedText 
            type="subtitle" 
            style={styles.title}
            numberOfLines={2}
          >
            {recipe.title}
          </ThemedText>

          {/* Infos de base */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <IconSymbol name="clock" size={14} color={colors.textLight} />
              <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                {recipe.cookTime}min
              </ThemedText>
            </View>
            
            <View style={styles.infoItem}>
              <IconSymbol name="chart.bar" size={14} color={getDifficultyColor(recipe.difficulty)} />
              <ThemedText style={[styles.infoText, { color: getDifficultyColor(recipe.difficulty) }]}>
                {recipe.difficulty}
              </ThemedText>
            </View>
          </View>

          {/* Portions et bouton à faire */}
          <View style={styles.footer}>
            <View style={styles.servingsContainer}>
              <IconSymbol name="person.2" size={16} color={colors.textLight} />
              <ThemedText style={[styles.servings, { color: colors.textLight }]}>
                {recipe.servings} personnes
              </ThemedText>
            </View>
            
            {onAddToTodo && (
              <TouchableOpacity 
                onPress={onAddToTodo}
                style={[styles.todoButton, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
              >
                <IconSymbol name="plus" size={14} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    overflow: 'hidden',
    width: cardWidth,
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    color: 'white',
    fontWeight: '600',
  },
  content: {
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  title: {
    lineHeight: 18,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    fontSize: FontSizes.sm,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  infoText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
    flex: 1,
    marginRight: Spacing.xs,
  },
  servings: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  todoButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  todoButtonText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: Spacing.xs / 2,
    color: 'white',
  },
});