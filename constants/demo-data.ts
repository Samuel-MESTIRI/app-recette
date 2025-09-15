// Données de démonstration pour l'application de recettes

export const DEMO_USERS = [
  {
    email: 'demo@recette.com',
    password: 'password',
    name: 'Utilisateur Demo'
  },
  {
    email: 'chef@recette.com', 
    password: '123456',
    name: 'Chef Cuisinier'
  }
];

export const DEMO_RECIPES = [
  {
    id: '1',
    title: 'Pâtes Carbonara',
    description: 'Un grand classique italien simple et délicieux',
    category: 'Pâtes',
    difficulty: 'Facile',
    duration: '20 min',
    image: '🍝',
    ingredients: [
      '400g de spaghetti',
      '150g de pancetta',
      '3 œufs',
      '100g de parmesan râpé',
      'Poivre noir'
    ],
    instructions: [
      'Faire cuire les pâtes dans l\'eau salée',
      'Faire revenir la pancetta',
      'Mélanger œufs et parmesan',
      'Incorporer le tout hors du feu'
    ]
  },
  {
    id: '2',
    title: 'Salade César',
    description: 'Salade fraîche avec croûtons et parmesan',
    category: 'Salades',
    difficulty: 'Facile',
    duration: '15 min',
    image: '🥗',
    ingredients: [
      'Laitue romaine',
      'Croûtons',
      'Parmesan',
      'Sauce César'
    ],
    instructions: [
      'Laver et couper la salade',
      'Préparer les croûtons',
      'Mélanger avec la sauce',
      'Ajouter le parmesan'
    ]
  }
];

export const DEMO_CATEGORIES = [
  { id: '1', name: 'Pâtes', emoji: '🍝', count: 5 },
  { id: '2', name: 'Salades', emoji: '🥗', count: 3 },
  { id: '3', name: 'Desserts', emoji: '🍰', count: 7 },
  { id: '4', name: 'Plats', emoji: '🍲', count: 12 },
  { id: '5', name: 'Soupes', emoji: '🍜', count: 4 },
  { id: '6', name: 'Boissons', emoji: '🥤', count: 2 }
];