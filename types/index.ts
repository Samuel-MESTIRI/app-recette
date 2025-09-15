/**
 * Point d'entrée pour tous les types de l'application
 */

// Export des types de recettes
export * from './recipe.types';

// Export des types d'utilisateurs
export * from './user.types';

// Export des types de liste de courses
export * from './shopping.types';

// Types communs
export interface BaseEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Types pour les formulaires
export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

// Types pour les listes paginées
export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Types pour les opérations CRUD
export type CrudOperation = 'create' | 'read' | 'update' | 'delete';

export interface CrudResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  operation: CrudOperation;
}