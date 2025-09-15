import { addShoppingItem } from '../services/shoppingService';

// Test de validation des données avec valeurs undefined
export const testShoppingItemValidation = async (userId: string) => {
  console.log('🧪 Test de validation des données shopping...');
  
  try {
    // Test 1: Données avec undefined (devrait marcher maintenant)
    const itemWithUndefined = {
      name: 'Test avec undefined',
      quantity: undefined, // Cette valeur undefined ne devrait plus causer d'erreur
      unit: undefined,
      category: 'test',
      source: 'manual' as const,
      priority: 'medium' as const
    };
    
    const itemId1 = await addShoppingItem(itemWithUndefined, userId);
    console.log('✅ Test 1 réussi - Valeurs undefined gérées:', itemId1);
    
    // Test 2: Données valides complètes
    const validItem = {
      name: 'Test complet',
      quantity: 100,
      unit: 'g',
      category: 'test',
      source: 'manual' as const,
      priority: 'medium' as const
    };
    
    const itemId2 = await addShoppingItem(validItem, userId);
    console.log('✅ Test 2 réussi - Données valides complètes:', itemId2);
    
    // Test 3: Données minimales (seulement nom)
    const minimalItem = {
      name: 'Test minimal',
      source: 'manual' as const
    };
    
    const itemId3 = await addShoppingItem(minimalItem, userId);
    console.log('✅ Test 3 réussi - Données minimales:', itemId3);
    
    console.log('🎉 Tous les tests de validation réussis !');
    
  } catch (error) {
    console.error('❌ Erreur dans les tests:', error);
  }
};

// Test des ingrédients avec anciens/nouveaux formats
export const testIngredientFormats = () => {
  const mockIngredients = [
    // Nouveau format (objet)
    { name: 'Tomates', quantity: 3, unit: 'pièces', category: 'légumes' },
    // Ancien format (string)
    'Huile d\'olive',
    // Format cassé (undefined name)
    { quantity: 100, unit: 'g' },
    // Format avec nom vide
    { name: '', quantity: 50 },
    // Format valide minimal
    { name: 'Sel' }
  ];
  
  console.log('🧪 Formats d\'ingrédients supportés:');
  
  mockIngredients.forEach((ingredient, index) => {
    let processedName: string;
    
    if (typeof ingredient === 'string') {
      processedName = ingredient;
      console.log(`✅ Format ${index + 1}: String - "${processedName}"`);
    } else if (typeof ingredient === 'object' && ingredient !== null) {
      processedName = (ingredient as any).name || (ingredient as any).text || 'Ingrédient sans nom';
      if (!processedName || processedName.trim() === '') {
        console.log(`⚠️ Format ${index + 1}: Objet ignoré (nom vide)`);
      } else {
        console.log(`✅ Format ${index + 1}: Objet - "${processedName}"`);
      }
    } else {
      console.log(`⚠️ Format ${index + 1}: Invalide - ignoré`);
    }
  });
};