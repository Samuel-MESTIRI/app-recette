import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { CreateRecipeData, Recipe } from '../types'; // Utiliser les nouveaux types

const COLLECTION_NAME = 'recipes';

// Ajouter une nouvelle recette
export const addRecipe = async (recipeData: CreateRecipeData, authorId: string): Promise<string> => {
  try {
    const recipe: Omit<Recipe, 'id'> = {
      ...recipeData,
      author: authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalTime: (recipeData.prepTime || 0) + recipeData.cookTime,
      rating: 0,
      ratingCount: 0,
      isFavorite: false,
      isPublic: recipeData.isPublic !== undefined ? recipeData.isPublic : true
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), recipe);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la recette:', error);
    throw error;
  }
};

// Récupérer toutes les recettes
export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const recipes: Recipe[] = [];
    querySnapshot.forEach((doc) => {
      recipes.push({
        id: doc.id,
        ...doc.data()
      } as Recipe);
    });
    
    return recipes;
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes:', error);
    throw error;
  }
};

// Récupérer les recettes par catégorie
export const getRecipesByCategory = async (category: string): Promise<Recipe[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const recipes: Recipe[] = [];
    querySnapshot.forEach((doc) => {
      recipes.push({
        id: doc.id,
        ...doc.data()
      } as Recipe);
    });
    
    return recipes;
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes par catégorie:', error);
    throw error;
  }
};

// Mettre à jour une recette
export const updateRecipe = async (id: string, updates: Partial<Recipe>): Promise<void> => {
  try {
    const recipeRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(recipeRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la recette:', error);
    throw error;
  }
};

// Supprimer une recette
export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Erreur lors de la suppression de la recette:', error);
    throw error;
  }
};