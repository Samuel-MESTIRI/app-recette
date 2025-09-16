import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Recipe } from '@/types';
import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - (Spacing.md * 3)) / 2; // 2 colonnes avec espacement réduit pour des cartes plus larges

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
  onFavoritePress?: () => void;
  onAddToTodo?: () => void;
}

export default function RecipeCard({ recipe, onPress, onFavoritePress, onAddToTodo }: RecipeCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.container} padding="none">
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: recipe.image }} 
            style={styles.image}
            resizeMode="cover"
          />
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
              <IconSymbol name="person.2" size={14} color={colors.textLight} />
              <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                {recipe.servings} pers.
              </ThemedText>
            </View>
          </View>

          {/* Boutons d'action */}
          <View style={styles.footer}>
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
            
            {onAddToTodo && (
              <TouchableOpacity 
                onPress={onAddToTodo}
                style={[styles.todoButton, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
              >
                <ThemedText style={styles.todoButtonText}>Ajouter</ThemedText>
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
    minHeight: 240, // Hauteur minimale fixe pour éviter les variations
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
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    padding: Spacing.sm,
    gap: Spacing.xs,
    flex: 1, // Permet au contenu de s'étendre pour maintenir la hauteur constante
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
    marginTop: 'auto', // Pousse le footer vers le bas
  },
  todoButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  todoButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});