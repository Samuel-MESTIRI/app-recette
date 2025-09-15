import { DEMO_RECIPES } from '../constants/demo-recipes';
import { addRecipe } from '../services/recipeService';
import { CreateRecipeData } from '../types';

/**
 * Fonction utilitaire pour migrer les données de démo vers Firebase
 * À exécuter une seule fois pour peupler la base de données
 */
export const migrateDemoDataToFirebase = async (authorId: string = 'demo-user') => {
  try {
    console.log('🚀 Début de la migration des données de démo vers Firebase...');
    
    for (const recipe of DEMO_RECIPES) {
      // Préparer les données selon le nouveau modèle CreateRecipeData
      const recipeData: CreateRecipeData = {
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        cookTime: recipe.cookTime,
        prepTime: recipe.prepTime,
        difficulty: recipe.difficulty,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        category: recipe.category,
        tags: recipe.tags,
        servings: recipe.servings,
        calories: recipe.calories,
        isPublic: recipe.isPublic !== false // true par défaut
      };
      
      const newRecipeId = await addRecipe(recipeData, authorId);
      console.log(`✅ Recette "${recipe.title}" migrée avec l'ID: ${newRecipeId}`);
    }
    
    console.log('🎉 Migration terminée avec succès !');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    return false;
  }
};

/**
 * Fonction pour ajouter une seule recette de test rapidement
 */
export const addTestRecipe = async (authorId: string = 'test-user') => {
  try {
    console.log('🧪 Ajout d\'une recette de test...');
    
    const testRecipe: CreateRecipeData = {
      title: "Pâtes Carbonara Test",
      description: "Une recette de test pour valider le système",
      cookTime: 15,
      prepTime: 10,
      difficulty: "facile",
      category: "Plat principal",
      servings: 4,
      ingredients: [
        {
          name: "Spaghetti",
          quantity: 400,
          unit: "g",
          category: "pâtes"
        },
        {
          name: "Lardons",
          quantity: 150,
          unit: "g", 
          category: "viandes"
        },
        {
          name: "Œufs",
          quantity: 3,
          unit: "pièces",
          category: "œufs"
        }
      ],
      instructions: [
        {
          step: 1,
          description: "Faire bouillir de l'eau salée",
          duration: 5
        },
        {
          step: 2,
          description: "Cuire les pâtes selon les instructions",
          duration: 8
        },
        {
          step: 3,
          description: "Mélanger avec les œufs et lardons",
          duration: 2
        }
      ],
      tags: [
        { name: "test", category: "other" },
        { name: "italien", category: "cuisine" }
      ],
      isPublic: true
    };
    
    const newRecipeId = await addRecipe(testRecipe, authorId);
    console.log(`✅ Recette de test créée avec l'ID: ${newRecipeId}`);
    return newRecipeId;
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de la recette de test:', error);
    return false;
  }
};

/**
 * Fonction pour vérifier si la base de données contient déjà des données
 */
import { getAllRecipes } from '../services/recipeService';

export const checkFirebaseData = async () => {
  try {
    const recipes = await getAllRecipes();
    console.log(`📊 Nombre de recettes dans Firebase: ${recipes.length}`);
    return recipes.length > 0;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des données:', error);
    return false;
  }
};

/**
 * 🎯 FONCTION RAPIDE POUR TESTER - Utilise celle-ci !
 * Ajoute rapidement quelques recettes de test
 */
export const addQuickTestData = async (authorId: string = 'test-user') => {
  try {
    console.log('🚀 Ajout rapide de données de test...');
    
    // Prendre seulement les 2 premières recettes de démo
    const testRecipes = DEMO_RECIPES.slice(0, 2);
    
    for (const recipe of testRecipes) {
      const recipeData: CreateRecipeData = {
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        cookTime: recipe.cookTime,
        prepTime: recipe.prepTime,
        difficulty: recipe.difficulty,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        category: recipe.category,
        tags: recipe.tags,
        servings: recipe.servings,
        calories: recipe.calories,
        isPublic: true
      };
      
      const newRecipeId = await addRecipe(recipeData, authorId);
      console.log(`✅ "${recipe.title}" ajoutée avec l'ID: ${newRecipeId}`);
    }
    
    console.log('🎉 Données de test ajoutées avec succès !');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données de test:', error);
    return false;
  }
};