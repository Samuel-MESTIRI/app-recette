import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import {
    addManualShoppingItem,
    addRecipeIngredientsToShoppingList,
    addShoppingItem,
    calculateShoppingListStats,
    clearShoppingList,
    createShoppingSnapshot,
    deleteShoppingItem,
    getShoppingHistory,
    getUserShoppingItems,
    groupItemsByCategory,
    groupItemsByRecipe,
    performBulkAction,
    updateShoppingItem
} from '../services/shoppingService';
import {
    BulkShoppingAction,
    CreateShoppingItemData,
    ShoppingItem,
    ShoppingItemsByCategory,
    ShoppingItemsByRecipe,
    ShoppingListStats,
    ShoppingSnapshot
} from '../types';

export const useShopping = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction utilitaire pour trier les éléments (non rayés en premier)
  const sortItems = (items: ShoppingItem[]): ShoppingItem[] => {
    return [...items].sort((a, b) => {
      // Les éléments "pending" (non rayés) avant les "purchased" (rayés)
      if (a.status === 'pending' && b.status === 'purchased') return -1;
      if (a.status === 'purchased' && b.status === 'pending') return 1;
      
      // Si même statut, trier par date de création (plus récent en premier)
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  };

  // Charger tous les éléments de l'utilisateur
  const fetchItems = async () => {
    console.log('🛒 fetchItems appelé');
    console.log('🛒 User:', user ? `${user.id} (${user.email})` : 'null');
    
    if (!user) {
      console.log('👤 Pas d\'utilisateur connecté - pas de fetch des éléments');
      setItems([]);
      setLoading(false);
      return;
    }

    console.log('🛒 Début fetch pour user:', user.id);
    setLoading(true);
    setError(null);
    try {
      const fetchedItems = await getUserShoppingItems(user.id);
      console.log('🛒 Items récupérés:', fetchedItems?.length || 0);
      if (fetchedItems?.length > 0) {
        console.log('🛒 Premier item:', fetchedItems[0]);
      }
      // Trier les éléments avec les non rayés en premier
      const sortedItems = sortItems(fetchedItems);
      setItems(sortedItems);
    } catch (err) {
      console.error('❌ Erreur fetchItems:', err);
      setError('Erreur lors du chargement de la liste de courses');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un élément
  const addItem = async (itemData: CreateShoppingItemData) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    setLoading(true);
    setError(null);
    try {
      const itemId = await addShoppingItem(itemData, user.id);
      await fetchItems(); // Recharger les éléments
      return itemId;
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'élément');
      console.error('Erreur addItem:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un élément manuel facilement
  const addManualItem = async (
    name: string, 
    options?: {
      quantity?: number;
      unit?: string;
      category?: string;
      priority?: 'low' | 'medium' | 'high';
      notes?: string;
    }
  ) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    setLoading(true);
    setError(null);
    try {
      const itemId = await addManualShoppingItem(name, user.id, options);
      await fetchItems(); // Recharger les éléments
      return itemId;
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'élément');
      console.error('Erreur addManualItem:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un élément
  const updateItem = async (itemId: string, updates: Partial<ShoppingItem>) => {
    setLoading(true);
    setError(null);
    try {
      await updateShoppingItem(itemId, updates);
      await fetchItems(); // Recharger les éléments
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'élément');
      console.error('Erreur updateItem:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un élément de manière optimiste (mise à jour immédiate de l'interface)
  const updateItemOptimistic = async (itemId: string, updates: Partial<ShoppingItem>) => {
    // Mise à jour optimiste : on modifie l'état local immédiatement
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === itemId 
          ? { ...item, ...updates, updatedAt: new Date() }
          : item
      );
      // Appliquer le tri pour que les éléments rayés aillent à la fin
      return sortItems(updatedItems);
    });

    // Ensuite on fait l'update en arrière-plan
    try {
      await updateShoppingItem(itemId, updates);
    } catch (err) {
      console.error('Erreur lors de l\'update en arrière-plan:', err);
      // En cas d'erreur, on recharge les données pour revenir à l'état correct
      await fetchItems();
      setError('Erreur lors de la synchronisation');
    }
  };

  // Supprimer un élément
  const removeItem = async (itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteShoppingItem(itemId);
      await fetchItems(); // Recharger les éléments
    } catch (err) {
      setError('Erreur lors de la suppression de l\'élément');
      console.error('Erreur removeItem:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Vider toute la liste
  const clearList = async () => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    setLoading(true);
    setError(null);
    try {
      await clearShoppingList(user.id);
      await fetchItems(); // Recharger les éléments
    } catch (err) {
      setError('Erreur lors du vidage de la liste');
      console.error('Erreur clearList:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Ajouter les ingrédients d'une recette
  const addRecipeIngredients = async (recipeId: string, recipeTitle: string, ingredients: any[]) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    setLoading(true);
    setError(null);
    try {
      const itemIds = await addRecipeIngredientsToShoppingList(
        recipeId,
        recipeTitle,
        ingredients,
        user.id
      );
      await fetchItems(); // Recharger les éléments
      return itemIds;
    } catch (err) {
      setError('Erreur lors de l\'ajout des ingrédients de recette');
      console.error('Erreur addRecipeIngredients:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actions en lot
  const bulkAction = async (action: BulkShoppingAction) => {
    setLoading(true);
    setError(null);
    try {
      await performBulkAction(action);
      await fetchItems(); // Recharger les éléments
    } catch (err) {
      setError('Erreur lors de l\'action en lot');
      console.error('Erreur bulkAction:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Finaliser les courses (créer un snapshot et supprimer les éléments achetés)
  const finalizeShopping = async (store?: string, notes?: string) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    setLoading(true);
    setError(null);
    try {
      const snapshotId = await createShoppingSnapshot(user.id, store, notes);
      await fetchItems(); // Recharger les éléments
      return snapshotId;
    } catch (err) {
      setError('Erreur lors de la finalisation des courses');
      console.error('Erreur finalizeShopping:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const getStats = (): ShoppingListStats => {
    return calculateShoppingListStats(items);
  };

  // Grouper par catégorie
  const getItemsByCategory = (): ShoppingItemsByCategory => {
    return groupItemsByCategory(items);
  };

  // Grouper par recette
  const getItemsByRecipe = (): ShoppingItemsByRecipe => {
    return groupItemsByRecipe(items);
  };

  // Filtrer les éléments
  const getFilteredItems = (status?: string, category?: string, source?: string): ShoppingItem[] => {
    return items.filter(item => {
      if (status && item.status !== status) return false;
      if (category && item.category !== category) return false;
      if (source && item.source !== source) return false;
      return true;
    });
  };

  // Charger les éléments au montage et lors des changements d'utilisateur
  useEffect(() => {
    fetchItems();
  }, [user]);

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    addManualItem,
    updateItem,
    updateItemOptimistic,
    removeItem,
    clearList,
    addRecipeIngredients,
    bulkAction,
    finalizeShopping,
    getStats,
    getItemsByCategory,
    getItemsByRecipe,
    getFilteredItems
  };
};

// Hook pour l'historique des courses
export const useShoppingHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ShoppingSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedHistory = await getShoppingHistory(user.id);
      setHistory(fetchedHistory);
    } catch (err) {
      setError('Erreur lors du chargement de l\'historique');
      console.error('Erreur fetchHistory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  return {
    history,
    loading,
    error,
    fetchHistory
  };
};