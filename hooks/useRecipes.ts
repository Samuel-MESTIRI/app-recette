import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { addRecipe, deleteRecipe, getAllRecipes, getRecipesByCategory, updateRecipe } from '../services/recipeService';
import { CreateRecipeData, Recipe } from '../types';

export const useRecipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les recettes (seulement si connecté)
  const fetchRecipes = async () => {
    if (!user) {
      console.log('👤 Pas d\'utilisateur connecté - pas de fetch des recettes');
      setRecipes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedRecipes = await getAllRecipes();
      setRecipes(fetchedRecipes);
    } catch (err) {
      setError('Erreur lors du chargement des recettes');
      console.error('Erreur fetchRecipes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les recettes par catégorie
  const fetchRecipesByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedRecipes = await getRecipesByCategory(category);
      setRecipes(fetchedRecipes);
    } catch (err) {
      setError('Erreur lors du chargement des recettes par catégorie');
      console.error('Erreur fetchRecipesByCategory:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter une recette
  const createRecipe = async (newRecipe: CreateRecipeData) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    setLoading(true);
    setError(null);
    try {
      const recipeId = await addRecipe(newRecipe, user.id);
      // Recharger les recettes pour mettre à jour la liste
      await fetchRecipes();
      return recipeId;
    } catch (err) {
      setError('Erreur lors de la création de la recette');
      console.error('Erreur createRecipe:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour une recette
  const editRecipe = async (id: string, updates: Partial<Recipe>) => {
    setLoading(true);
    setError(null);
    try {
      await updateRecipe(id, updates);
      // Recharger les recettes pour mettre à jour la liste
      await fetchRecipes();
    } catch (err) {
      setError('Erreur lors de la mise à jour de la recette');
      console.error('Erreur editRecipe:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une recette
  const removeRecipe = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteRecipe(id);
      // Retirer la recette de la liste locale
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de la recette');
      console.error('Erreur removeRecipe:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Charger les recettes au montage du composant (seulement si connecté)
  useEffect(() => {
    if (user) {
      fetchRecipes();
    } else {
      setRecipes([]);
      setLoading(false);
    }
  }, [user]); // Dépendance sur user

  return {
    recipes,
    loading,
    error,
    fetchRecipes,
    fetchRecipesByCategory,
    createRecipe,
    editRecipe,
    removeRecipe,
    refetch: fetchRecipes
  };
};