import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.config';

async function testShoppingData() {
  try {
    console.log('🔥 Test de connexion Firebase...');
    
    // Test récupération de tous les éléments de shopping
    const snapshot = await getDocs(collection(db, 'shoppingItems'));
    console.log('📊 Nombre total de documents dans shoppingItems:', snapshot.size);
    
    const items: any[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      items.push({ id: doc.id, ...data });
      console.log('📄 Document:', doc.id);
      console.log('   - Name:', data.name);
      console.log('   - UserId:', data.userId);
      console.log('   - Status:', data.status);
      console.log('   - Source:', data.source);
      console.log('   - Created:', data.createdAt?.toDate?.() || data.createdAt);
    });
    
    console.log('\n✅ Test terminé avec succès');
    return items;
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    throw error;
  }
}

// Export pour utilisation
export { testShoppingData };
