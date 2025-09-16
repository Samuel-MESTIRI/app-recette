import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import {
  BulkShoppingAction,
  CreateShoppingItemData,
  ShoppingItem,
  ShoppingItemsByCategory,
  ShoppingItemsByRecipe,
  ShoppingListStats,
  ShoppingSnapshot
} from '../types';

const SHOPPING_ITEMS_COLLECTION = 'shoppingItems';
const SHOPPING_SNAPSHOTS_COLLECTION = 'shoppingSnapshots';

// === GESTION DES ÉLÉMENTS DE LISTE DE COURSES ===

// Ajouter un élément à la liste de courses de l'utilisateur
export const addShoppingItem = async (itemData: CreateShoppingItemData, userId: string): Promise<string> => {
  try {
    // Validation des données requises
    if (!itemData.name || typeof itemData.name !== 'string' || itemData.name.trim() === '') {
      throw new Error('Le nom de l\'élément est requis et ne peut pas être vide');
    }
    
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('L\'ID utilisateur est requis');
    }
    
    // Nettoyer les données pour Firestore (pas de valeurs undefined)
    const cleanItemData: any = {
      name: itemData.name.trim(),
      userId: userId.trim(),
      status: 'pending',
      priority: itemData.priority || 'medium',
      source: itemData.source || 'manual',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Ajouter les champs optionnels seulement s'ils ne sont pas undefined
    if (itemData.quantity !== undefined && itemData.quantity !== null) {
      cleanItemData.quantity = itemData.quantity;
    }
    
    if (itemData.unit !== undefined && itemData.unit !== null && itemData.unit.trim() !== '') {
      cleanItemData.unit = itemData.unit.trim();
    }
    
    if (itemData.category !== undefined && itemData.category !== null && itemData.category.trim() !== '') {
      cleanItemData.category = itemData.category.trim();
    }
    
    if (itemData.recipeId !== undefined && itemData.recipeId !== null && itemData.recipeId.trim() !== '') {
      cleanItemData.recipeId = itemData.recipeId.trim();
    }
    
    if (itemData.recipeTitle !== undefined && itemData.recipeTitle !== null && itemData.recipeTitle.trim() !== '') {
      cleanItemData.recipeTitle = itemData.recipeTitle.trim();
    }

    const docRef = await addDoc(collection(db, SHOPPING_ITEMS_COLLECTION), cleanItemData);
    
    console.log(`✅ Élément ajouté avec l'ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de l\'élément:', error);
    throw error;
  }
};

// Fonction helper pour ajouter un élément manuel facilement
export const addManualShoppingItem = async (
  name: string, 
  userId: string, 
  options?: {
    quantity?: number;
    unit?: string;
    category?: string;
    priority?: 'low' | 'medium' | 'high';
    notes?: string;
  }
): Promise<string> => {
  const itemData: CreateShoppingItemData = {
    name,
    source: 'manual',
    ...options
  };
  
  return addShoppingItem(itemData, userId);
};

// Récupérer tous les éléments de la liste de courses d'un utilisateur
export const getUserShoppingItems = async (userId: string): Promise<ShoppingItem[]> => {
  try {
    console.log('🔥 getUserShoppingItems pour userId:', userId);
    
    const q = query(
      collection(db, SHOPPING_ITEMS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    console.log('🔥 Exécution de la requête Firestore...');
    const querySnapshot = await getDocs(q);
    console.log('🔥 Requête terminée, docs trouvés:', querySnapshot.size);
    
    const items: ShoppingItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('🔥 Doc trouvé:', doc.id, data.name, data.status);
      items.push({
        id: doc.id,
        ...data
      } as ShoppingItem);
    });
    
    console.log('🔥 Retour de', items.length, 'items');
    return items;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des éléments:', error);
    throw error;
  }
};

// Mettre à jour un élément de la liste
export const updateShoppingItem = async (itemId: string, updates: Partial<ShoppingItem>): Promise<void> => {
  try {
    const itemRef = doc(db, SHOPPING_ITEMS_COLLECTION, itemId);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: new Date(),
      ...(updates.status === 'purchased' && { purchasedAt: new Date() })
    });
    
    console.log(`✅ Élément ${itemId} mis à jour`);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'élément:', error);
    throw error;
  }
};

// Supprimer un élément de la liste
export const deleteShoppingItem = async (itemId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, SHOPPING_ITEMS_COLLECTION, itemId));
    console.log(`✅ Élément ${itemId} supprimé`);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'élément:', error);
    throw error;
  }
};

// Vider complètement la liste de courses d'un utilisateur
export const clearShoppingList = async (userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, SHOPPING_ITEMS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`✅ Liste de courses vidée pour l'utilisateur ${userId}`);
  } catch (error) {
    console.error('❌ Erreur lors du vidage de la liste:', error);
    throw error;
  }
};

// === FONCTIONS UTILITAIRES ===

// Ajouter des ingrédients d'une recette à la liste de courses
export const addRecipeIngredientsToShoppingList = async (
  recipeId: string,
  recipeTitle: string,
  ingredients: any[],
  userId: string
): Promise<string[]> => {
  try {
    const itemIds: string[] = [];
    
    for (const ingredient of ingredients) {
      // Validation et normalisation des données d'ingrédient
      let ingredientName: string;
      let ingredientQuantity: number | undefined;
      let ingredientUnit: string | undefined;
      let ingredientCategory: string | undefined;
      
      if (typeof ingredient === 'string') {
        // Ancien format (chaîne de caractères)
        ingredientName = ingredient;
        ingredientQuantity = undefined;
        ingredientUnit = undefined;
        ingredientCategory = 'autre';
      } else if (typeof ingredient === 'object' && ingredient !== null) {
        // Nouveau format (objet)
        ingredientName = ingredient.name || ingredient.text || 'Ingrédient sans nom';
        ingredientQuantity = ingredient.quantity;
        ingredientUnit = ingredient.unit;
        ingredientCategory = ingredient.category || 'autre';
      } else {
        console.warn('⚠️ Ingrédient ignoré (format invalide):', ingredient);
        continue;
      }
      
      // Vérification finale que le nom n'est pas vide
      if (!ingredientName || ingredientName.trim() === '') {
        console.warn('⚠️ Ingrédient ignoré (nom vide):', ingredient);
        continue;
      }
      
      // Créer les données en évitant les valeurs undefined
      const itemData: CreateShoppingItemData = {
        name: ingredientName.trim(),
        source: 'recipe',
        recipeId,
        recipeTitle,
        priority: 'medium'
      };
      
      // Ajouter les champs optionnels seulement s'ils sont définis
      if (ingredientQuantity !== undefined && ingredientQuantity !== null && !isNaN(ingredientQuantity)) {
        itemData.quantity = ingredientQuantity;
      }
      
      if (ingredientUnit !== undefined && ingredientUnit !== null && ingredientUnit.trim() !== '') {
        itemData.unit = ingredientUnit.trim();
      }
      
      if (ingredientCategory !== undefined && ingredientCategory !== null && ingredientCategory.trim() !== '') {
        itemData.category = ingredientCategory.trim();
      } else {
        itemData.category = 'autre'; // Valeur par défaut
      }
      
      const itemId = await addShoppingItem(itemData, userId);
      itemIds.push(itemId);
    }
    
    console.log(`✅ ${ingredients.length} ingrédients ajoutés de la recette "${recipeTitle}"`);
    return itemIds;
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des ingrédients de recette:', error);
    throw error;
  }
};

// Grouper les éléments par catégorie
export const groupItemsByCategory = (items: ShoppingItem[]): ShoppingItemsByCategory => {
  return items.reduce((groups, item) => {
    const category = item.category || 'Autre';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as ShoppingItemsByCategory);
};

// Grouper les éléments par recette
export const groupItemsByRecipe = (items: ShoppingItem[]): ShoppingItemsByRecipe => {
  return items.reduce((groups, item) => {
    if (item.source === 'manual') {
      if (!groups.manual) {
        groups.manual = [];
      }
      groups.manual.push(item);
    } else {
      const recipeTitle = item.recipeTitle || 'Recette inconnue';
      if (!groups[recipeTitle]) {
        groups[recipeTitle] = [];
      }
      groups[recipeTitle].push(item);
    }
    return groups;
  }, { manual: [] } as ShoppingItemsByRecipe);
};

// Calculer les statistiques de la liste
export const calculateShoppingListStats = (items: ShoppingItem[]): ShoppingListStats => {
  const totalItems = items.length;
  const pendingItems = items.filter(item => item.status === 'pending').length;
  const purchasedItems = items.filter(item => item.status === 'purchased').length;
  const unavailableItems = items.filter(item => item.status === 'unavailable').length;
  
  const totalEstimated = items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
  const totalActual = items.reduce((sum, item) => sum + (item.actualPrice || 0), 0);
  
  const completionRate = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0;
  
  const categories = items.reduce((cats, item) => {
    const category = item.category || 'Autre';
    cats[category] = (cats[category] || 0) + 1;
    return cats;
  }, {} as { [category: string]: number });

  const uniqueRecipes = new Set(
    items
      .filter(item => item.source === 'recipe' && item.recipeId)
      .map(item => item.recipeId)
  );
  const recipeCount = uniqueRecipes.size;

  return {
    totalItems,
    pendingItems,
    purchasedItems,
    unavailableItems,
    totalEstimated,
    totalActual,
    completionRate,
    categories,
    recipeCount
  };
};

// Actions en lot sur les éléments
export const performBulkAction = async (action: BulkShoppingAction): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    for (const itemId of action.itemIds) {
      const itemRef = doc(db, SHOPPING_ITEMS_COLLECTION, itemId);
      
      switch (action.action) {
        case 'mark_purchased':
          batch.update(itemRef, {
            status: 'purchased',
            actualPrice: action.actualPrice,
            purchasedAt: new Date(),
            updatedAt: new Date()
          });
          break;
        case 'mark_pending':
          batch.update(itemRef, {
            status: 'pending',
            updatedAt: new Date()
          });
          break;
        case 'mark_unavailable':
          batch.update(itemRef, {
            status: 'unavailable',
            updatedAt: new Date()
          });
          break;
        case 'delete':
          batch.delete(itemRef);
          break;
      }
    }
    
    await batch.commit();
    console.log(`✅ Action en lot "${action.action}" effectuée sur ${action.itemIds.length} éléments`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'action en lot:', error);
    throw error;
  }
};

// Créer un snapshot de la liste actuelle (pour l'historique)
export const createShoppingSnapshot = async (userId: string, store?: string, notes?: string): Promise<string> => {
  try {
    const items = await getUserShoppingItems(userId);
    const purchasedItems = items.filter(item => item.status === 'purchased');
    
    if (purchasedItems.length === 0) {
      throw new Error('Aucun élément acheté à sauvegarder');
    }
    
    const totalAmount = purchasedItems.reduce((sum, item) => sum + (item.actualPrice || 0), 0);
    
    const snapshot: Omit<ShoppingSnapshot, 'id'> = {
      userId,
      items: purchasedItems,
      totalAmount,
      completedAt: new Date(),
      store,
      notes
    };
    
    const docRef = await addDoc(collection(db, SHOPPING_SNAPSHOTS_COLLECTION), snapshot);
    
    // Supprimer les éléments achetés de la liste courante
    const batch = writeBatch(db);
    purchasedItems.forEach(item => {
      if (item.id) {
        batch.delete(doc(db, SHOPPING_ITEMS_COLLECTION, item.id));
      }
    });
    await batch.commit();
    
    console.log(`✅ Snapshot créé avec l'ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Erreur lors de la création du snapshot:', error);
    throw error;
  }
};

// Récupérer l'historique des courses
export const getShoppingHistory = async (userId: string): Promise<ShoppingSnapshot[]> => {
  try {
    const q = query(
      collection(db, SHOPPING_SNAPSHOTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const snapshots: ShoppingSnapshot[] = [];
    
    querySnapshot.forEach((doc) => {
      snapshots.push({
        id: doc.id,
        ...doc.data()
      } as ShoppingSnapshot);
    });
    
    return snapshots;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'historique:', error);
    throw error;
  }
};