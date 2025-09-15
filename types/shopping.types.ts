/**
 * Modèles de données pour la liste de courses
 * Une seule liste par utilisateur
 */


// Type pour l'origine d'un ingrédient dans la liste de courses
export type ShoppingItemSource = 'recipe' | 'manual';

// Statut d'un élément de la liste de courses
export type ShoppingItemStatus = 'pending' | 'purchased' | 'unavailable';

// Interface pour un élément de la liste de courses
export interface ShoppingItem {
  id?: string; // ID généré par Firebase
  
  // Informations de base (héritées d'Ingredient)
  name: string;
  quantity?: number;
  unit?: string;
  category?: string;
  
  // Métadonnées spécifiques à la liste de courses
  source: ShoppingItemSource; // 'recipe' ou 'manual'
  status: ShoppingItemStatus; // 'pending', 'purchased', 'unavailable'
  
  // Informations de traçabilité pour les ingrédients de recettes
  recipeId?: string; // ID de la recette d'origine (si source = 'recipe')
  recipeTitle?: string; // Titre de la recette pour affichage
  
  // Métadonnées utilisateur
  notes?: string; // Notes personnelles (marque préférée, magasin, etc.)
  priority?: 'low' | 'medium' | 'high'; // Priorité d'achat
  estimatedPrice?: number; // Prix estimé
  actualPrice?: number; // Prix réel payé
  
  // Métadonnées système
  userId: string; // Propriétaire de l'élément
  createdAt?: Date;
  updatedAt?: Date;
  purchasedAt?: Date; // Date d'achat
}

// Interface pour créer un nouvel élément de liste de courses
export interface CreateShoppingItemData {
  name: string;
  quantity?: number;
  unit?: string;
  category?: string;
  source: ShoppingItemSource;
  recipeId?: string;
  recipeTitle?: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  estimatedPrice?: number;
}

// Interface pour les filtres de recherche dans la liste
export interface ShoppingItemFilter {
  status?: ShoppingItemStatus;
  source?: ShoppingItemSource;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  recipeId?: string;
  search?: string; // Recherche textuelle
}

// Interface pour les statistiques de la liste de courses
export interface ShoppingListStats {
  totalItems: number;
  pendingItems: number;
  purchasedItems: number;
  unavailableItems: number;
  totalEstimated: number;
  totalActual: number;
  completionRate: number; // Pourcentage de completion (0-100)
  categories: { [category: string]: number }; // Nombre d'éléments par catégorie
  recipeCount: number; // Nombre de recettes représentées
}

// Interface pour grouper les éléments par catégorie
export interface ShoppingItemsByCategory {
  [category: string]: ShoppingItem[];
}

// Interface pour grouper les éléments par recette
export interface ShoppingItemsByRecipe {
  [recipeTitle: string]: ShoppingItem[];
  manual: ShoppingItem[]; // Éléments ajoutés manuellement
}

// Interface pour les suggestions d'ingrédients récurrents
export interface ShoppingItemSuggestion {
  name: string;
  frequency: number; // Nombre de fois acheté
  lastPurchased?: Date;
  averagePrice?: number;
  preferredBrand?: string;
  category?: string;
}

// Types utilitaires
export type ShoppingItemID = string;

// Interface pour les actions en lot sur les éléments
export interface BulkShoppingAction {
  itemIds: ShoppingItemID[];
  action: 'mark_purchased' | 'mark_pending' | 'mark_unavailable' | 'delete';
  actualPrice?: number; // Pour les achats en lot
}

// Interface pour l'historique des courses (snapshots de listes finalisées)
export interface ShoppingSnapshot {
  id?: string;
  userId: string;
  items: ShoppingItem[];
  totalAmount: number;
  completedAt: Date;
  store?: string; // Magasin où les courses ont été faites
  notes?: string; // Notes sur cette session de courses
}