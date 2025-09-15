/**
 * Modèles de données pour les utilisateurs et l'authentification
 */

// Interface pour un utilisateur
export interface User {
  id: string;
  email: string;
  name: string;
  photo?: string | null;
  
  // Informations du profil
  bio?: string;
  location?: string;
  website?: string;
  
  // Préférences
  preferences?: UserPreferences;
  
  // Statistiques
  stats?: UserStats;
  
  // Métadonnées
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  
  // Paramètres de compte
  isPublic?: boolean; // Profil public
  isVerified?: boolean; // Compte vérifié
  role?: UserRole;
}

// Rôles utilisateur
export type UserRole = 'user' | 'admin' | 'moderator';

// Préférences utilisateur
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  units?: 'metric' | 'imperial'; // Système de mesure
  notifications?: NotificationSettings;
  privacy?: PrivacySettings;
}

// Paramètres de notifications
export interface NotificationSettings {
  email?: boolean;
  push?: boolean;
  newRecipes?: boolean;
  recipeUpdates?: boolean;
  comments?: boolean;
  followers?: boolean;
}

// Paramètres de confidentialité
export interface PrivacySettings {
  showEmail?: boolean;
  showStats?: boolean;
  allowMessages?: boolean;
  searchable?: boolean;
}

// Statistiques utilisateur
export interface UserStats {
  recipesCount: number;
  favoritesCount: number;
  followersCount: number;
  followingCount: number;
  totalViews: number;
  averageRating: number;
}

/**
 * Modèles pour les interactions sociales
 */

// Interface pour suivre des utilisateurs
export interface UserFollow {
  id?: string;
  followerId: string; // Utilisateur qui suit
  followingId: string; // Utilisateur suivi
  createdAt: Date;
}

// Interface pour les commentaires
export interface Comment {
  id?: string;
  recipeId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  rating?: number; // Note donnée avec le commentaire
  createdAt: Date;
  updatedAt?: Date;
  parentId?: string; // Pour les réponses aux commentaires
  likes?: number;
  isEdited?: boolean;
}

// Interface pour les likes/favoris
export interface RecipeLike {
  id?: string;
  recipeId: string;
  userId: string;
  createdAt: Date;
}

/**
 * Modèles pour la gestion de l'app
 */

// État global de l'application
export interface AppState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  language: string;
}

// Configuration de l'application
export interface AppConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  features: {
    socialFeatures: boolean;
    premium: boolean;
    offline: boolean;
  };
}

// Erreurs de l'application
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

/**
 * Types utilitaires
 */

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T> {
  data?: T;
  error?: AppError;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}