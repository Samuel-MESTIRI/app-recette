import { DifficultyLevel, Ingredient, Instruction, Recipe, RecipeCategory, Tag } from '../types';

// Catégories disponibles pour les filtres
export const RECIPE_CATEGORIES: RecipeCategory[] = [
  'Entrée',
  'Plat principal', 
  'Dessert',
  'Apéritif',
  'Boisson',
  'Petit-déjeuner',
  'Collation',
  'Sauce',
  'Autre'
];

export const DEMO_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Pasta Carbonara',
    description: 'Un classique italien authentique avec des œufs, du fromage et des lardons croustillants.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
    cookTime: 20,
    prepTime: 10,
    totalTime: 30,
    difficulty: 'facile' as DifficultyLevel,
    rating: 4.8,
    ratingCount: 25,
    category: 'Plat principal' as RecipeCategory,
    servings: 4,
    calories: 520,
    ingredients: [
      {
        name: 'spaghetti',
        quantity: 400,
        unit: 'g',
        category: 'pâtes'
      },
      {
        name: 'lardons',
        quantity: 150,
        unit: 'g',
        category: 'viandes'
      },
      {
        name: 'œufs entiers',
        quantity: 3,
        unit: 'pièces',
        category: 'œufs'
      },
      {
        name: 'parmesan râpé',
        quantity: 100,
        unit: 'g',
        category: 'fromages'
      },
      {
        name: 'poivre noir',
        quantity: 1,
        unit: 'cuillère à café',
        category: 'épices'
      }
    ] as Ingredient[],
    instructions: [
      {
        step: 1,
        description: 'Faire bouillir une grande casserole d\'eau salée.',
        duration: 5
      },
      {
        step: 2,
        description: 'Cuire les spaghetti selon les instructions du paquet.',
        duration: 10
      },
      {
        step: 3,
        description: 'Pendant ce temps, faire revenir les lardons dans une poêle.',
        duration: 5
      },
      {
        step: 4,
        description: 'Battre les œufs avec le parmesan et le poivre.',
        duration: 2
      },
      {
        step: 5,
        description: 'Égoutter les pâtes et les mélanger avec les lardons et le mélange d\'œufs hors du feu.',
        duration: 3
      }
    ] as Instruction[],
    tags: [
      { name: 'italien', category: 'cuisine' },
      { name: 'rapide', category: 'technique' },
      { name: 'traditionnel', category: 'other' }
    ] as Tag[],
    author: 'demo-user',
    authorName: 'Chef Demo',
    isFavorite: false,
    isPublic: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Ratatouille Provençale',
    description: 'Un mélange coloré de légumes méditerranéens mijotés aux herbes de Provence.',
    image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=300&fit=crop',
    cookTime: 45,
    prepTime: 20,
    totalTime: 65,
    difficulty: 'moyen' as DifficultyLevel,
    rating: 4.6,
    ratingCount: 18,
    category: 'Plat principal' as RecipeCategory,
    servings: 6,
    calories: 180,
    ingredients: [
      {
        name: 'aubergines',
        quantity: 2,
        unit: 'pièces',
        category: 'légumes'
      },
      {
        name: 'courgettes',
        quantity: 2,
        unit: 'pièces',
        category: 'légumes'
      },
      {
        name: 'tomates',
        quantity: 4,
        unit: 'pièces',
        category: 'légumes'
      },
      {
        name: 'poivrons rouges',
        quantity: 2,
        unit: 'pièces',
        category: 'légumes'
      },
      {
        name: 'oignon',
        quantity: 1,
        unit: 'pièce',
        category: 'légumes'
      },
      {
        name: 'herbes de Provence',
        quantity: 2,
        unit: 'cuillères à café',
        category: 'épices'
      }
    ] as Ingredient[],
    instructions: [
      {
        step: 1,
        description: 'Couper tous les légumes en dés de taille similaire.',
        duration: 15
      },
      {
        step: 2,
        description: 'Faire revenir l\'oignon dans l\'huile d\'olive.',
        duration: 5
      },
      {
        step: 3,
        description: 'Ajouter les autres légumes et les herbes.',
        duration: 5
      },
      {
        step: 4,
        description: 'Laisser mijoter à feu doux pendant 45 minutes.',
        duration: 45
      }
    ] as Instruction[],
    tags: [
      { name: 'végétarien', category: 'diet' },
      { name: 'méditerranéen', category: 'cuisine' },
      { name: 'sain', category: 'other' }
    ] as Tag[],
    author: 'demo-user',
    authorName: 'Grand-mère Provence',
    isFavorite: false,
    isPublic: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '3',
    title: 'Tarte Tatin aux Pommes',
    description: 'La célèbre tarte française renversée aux pommes caramélisées.',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a4d4729?w=400&h=300&fit=crop',
    cookTime: 50,
    prepTime: 30,
    totalTime: 80,
    difficulty: 'moyen' as DifficultyLevel,
    rating: 4.7,
    ratingCount: 32,
    category: 'Dessert' as RecipeCategory,
    servings: 8,
    calories: 280,
    ingredients: [
      {
        name: 'pâte brisée',
        quantity: 1,
        unit: 'rouleau',
        category: 'pâtisserie'
      },
      {
        name: 'pommes Golden',
        quantity: 8,
        unit: 'pièces',
        category: 'fruits'
      },
      {
        name: 'sucre en poudre',
        quantity: 150,
        unit: 'g',
        category: 'sucrants'
      },
      {
        name: 'beurre',
        quantity: 50,
        unit: 'g',
        category: 'matières grasses'
      },
      {
        name: 'cannelle',
        quantity: 1,
        unit: 'pincée',
        category: 'épices'
      }
    ] as Ingredient[],
    instructions: [
      {
        step: 1,
        description: 'Préchauffer le four à 200°C.',
        duration: 5,
        temperature: 200
      },
      {
        step: 2,
        description: 'Éplucher et couper les pommes en quartiers.',
        duration: 15
      },
      {
        step: 3,
        description: 'Faire un caramel avec le sucre dans une poêle.',
        duration: 10
      },
      {
        step: 4,
        description: 'Disposer les pommes sur le caramel.',
        duration: 5
      },
      {
        step: 5,
        description: 'Recouvrir avec la pâte et enfourner 30 minutes.',
        duration: 30,
        temperature: 200
      }
    ] as Instruction[],
    tags: [
      { name: 'français', category: 'cuisine' },
      { name: 'dessert', category: 'other' },
      { name: 'pommes', category: 'other' }
    ] as Tag[],
    author: 'demo-user',
    authorName: 'Pâtissier François',
    isFavorite: false,
    isPublic: true,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  }
];