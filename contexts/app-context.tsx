import { Recipe } from '@/constants/demo-recipes';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface TodoRecipe extends Recipe {
  addedAt: Date;
}

export type { TodoRecipe };

interface ShoppingItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  recipeId?: string; // Pour lier l'ingrédient à une recette
}

interface AppContextType {
  // Recettes à faire
  todoRecipes: TodoRecipe[];
  addRecipeToTodo: (recipe: Recipe) => boolean;
  removeRecipeFromTodo: (recipeId: string) => void;
  markRecipeAsDone: (recipeId: string) => void;
  
  // Liste de courses
  shoppingItems: ShoppingItem[];
  addShoppingItem: (text: string, recipeId?: string) => void;
  removeShoppingItem: (itemId: string) => void;
  toggleShoppingItem: (itemId: string) => void;
  addIngredientsFromRecipe: (recipe: Recipe) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [todoRecipes, setTodoRecipes] = useState<TodoRecipe[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);

  const addRecipeToTodo = (recipe: Recipe) => {
    // Vérifier si la recette n'est pas déjà dans la liste
    const exists = todoRecipes.some(todo => todo.id === recipe.id);
    if (exists) {
      return false; // Recette déjà ajoutée
    }

    const todoRecipe: TodoRecipe = {
      ...recipe,
      addedAt: new Date(),
    };

    setTodoRecipes(prev => [todoRecipe, ...prev]);
    return true; // Succès
  };

  const removeRecipeFromTodo = (recipeId: string) => {
    setTodoRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    
    // Optionnel : retirer aussi les ingrédients liés à cette recette de la liste de courses
    setShoppingItems(prev => prev.filter(item => item.recipeId !== recipeId));
  };

  const markRecipeAsDone = (recipeId: string) => {
    // Retirer la recette des "à faire"
    removeRecipeFromTodo(recipeId);
  };

  const addShoppingItem = (text: string, recipeId?: string) => {
    const newItem: ShoppingItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      recipeId,
    };

    setShoppingItems(prev => [newItem, ...prev]);
  };

  const removeShoppingItem = (itemId: string) => {
    setShoppingItems(prev => prev.filter(item => item.id !== itemId));
  };

  const toggleShoppingItem = (itemId: string) => {
    setShoppingItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addIngredientsFromRecipe = (recipe: Recipe) => {
    // Simuler l'ajout des ingrédients (les recettes démo n'ont pas d'ingrédients détaillés)
    // Dans une vraie app, recipe.ingredients serait un tableau d'ingrédients
    const mockIngredients = [
      `Ingrédients pour ${recipe.title}`,
      'Ingrédient principal 1',
      'Ingrédient principal 2',
      'Assaisonnements'
    ];

    mockIngredients.forEach(ingredient => {
      // Vérifier si l'ingrédient n'existe pas déjà
      const exists = shoppingItems.some(item => 
        item.text === ingredient && item.recipeId === recipe.id
      );
      
      if (!exists) {
        addShoppingItem(ingredient, recipe.id);
      }
    });
  };

  return (
    <AppContext.Provider value={{
      todoRecipes,
      addRecipeToTodo,
      removeRecipeFromTodo,
      markRecipeAsDone,
      shoppingItems,
      addShoppingItem,
      removeShoppingItem,
      toggleShoppingItem,
      addIngredientsFromRecipe,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}