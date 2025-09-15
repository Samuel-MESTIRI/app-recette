/**
 * Modèles de données pour l'application de recettes
 */

// Type pour la difficulté des recettes
export type DifficultyLevel = 'facile' | 'moyen' | 'difficile';

// Type pour les catégories de recettes
export type RecipeCategory = 
  | 'Entrée'
  | 'Plat principal'
  | 'Dessert'
  | 'Apéritif'
  | 'Boisson'
  | 'Petit-déjeuner'
  | 'Collation'
  | 'Sauce'
  | 'Autre';

// Interface pour un ingrédient avec quantité
export interface Ingredient {
  id?: string;
  name: string;
  quantity?: number;
  unit?: string; // 'g', 'kg', 'ml', 'l', 'cuillère', 'tasse', 'pincée', etc.
  category?: string; // 'légumes', 'viandes', 'épices', etc.
  optional?: boolean; // Ingrédient optionnel
}

// Interface pour une instruction de préparation
export interface Instruction {
  id?: string;
  step: number;
  description: string;
  duration?: number; // Durée en minutes pour cette étape
  temperature?: number; // Température si nécessaire (four, etc.)
  image?: string; // Image optionnelle pour illustrer l'étape
}

// Interface pour un tag
export interface Tag {
  id?: string;
  name: string;
  color?: string; // Couleur pour l'affichage
  category?: 'diet' | 'cuisine' | 'occasion' | 'technique' | 'other';
}

// Interface principale pour une recette
export interface Recipe {
  // Identifiants
  id?: string; // Généré automatiquement par Firebase
  
  // Informations de base
  title: string;
  description?: string;
  image?: string; // URL de l'image principale
  
  // Temps et difficulté
  cookTime: number; // Temps de cuisson en minutes
  prepTime?: number; // Temps de préparation en minutes
  totalTime?: number; // Temps total (calculé automatiquement)
  difficulty: DifficultyLevel;
  
  // Contenu de la recette
  ingredients: Ingredient[];
  instructions: Instruction[];
  
  // Classification
  category?: RecipeCategory;
  tags?: Tag[];
  
  // Informations nutritionnelles (optionnelles)
  servings?: number; // Nombre de portions
  calories?: number; // Calories par portion
  
  // Métadonnées
  author?: string; // ID de l'utilisateur créateur
  authorName?: string; // Nom affiché de l'auteur
  createdAt?: Date;
  updatedAt?: Date;
  
  // Interactions utilisateur
  rating?: number; // Note moyenne (0-5)
  ratingCount?: number; // Nombre de votes
  isFavorite?: boolean; // Favori pour l'utilisateur actuel
  isPublic?: boolean; // Recette publique ou privée
  
  // Métadonnées techniques
  source?: string; // Source originale si importée
  language?: string; // Langue de la recette
  images?: string[]; // Images supplémentaires
}

// Interface pour les données de création/mise à jour (sans les champs générés)
export interface CreateRecipeData {
  title: string;
  description?: string;
  image?: string;
  cookTime: number;
  prepTime?: number;
  difficulty: DifficultyLevel;
  ingredients: Ingredient[];
  instructions: Instruction[];
  category?: RecipeCategory;
  tags?: Tag[];
  servings?: number;
  calories?: number;
  isPublic?: boolean;
}

// Interface pour les filtres de recherche
export interface RecipeFilter {
  category?: RecipeCategory;
  difficulty?: DifficultyLevel;
  maxCookTime?: number;
  tags?: string[];
  author?: string;
  rating?: number; // Minimum rating
  search?: string; // Recherche textuelle
}

// Interface pour les statistiques d'une recette
export interface RecipeStats {
  viewCount: number;
  favoriteCount: number;
  ratingAverage: number;
  ratingCount: number;
  createdAt: Date;
  lastViewedAt?: Date;
}

// Types utilitaires
export type RecipeID = string;
export type UserID = string;

// Interface pour les collections de recettes
export interface RecipeCollection {
  id?: string;
  name: string;
  description?: string;
  recipes: RecipeID[];
  owner: UserID;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}