import { auth, db } from '../config/firebase.config';

/**
 * Fonction pour tester la configuration Firebase
 */
export const testFirebaseConfig = async () => {
  console.log('🔥 Test de la configuration Firebase...');
  
  try {
    // Test 1: Vérifier que Firebase Auth est initialisé
    console.log('📱 Firebase Auth App:', auth.app.name);
    console.log('🔐 Firebase Auth config:', auth.config);
    
    // Test 2: Vérifier que Firestore est initialisé  
    console.log('🗄️ Firestore App:', db.app.name);
    
    // Test 3: Vérifier l'état d'authentification actuel
    console.log('👤 Utilisateur actuel:', auth.currentUser ? 'Connecté' : 'Déconnecté');
    
    console.log('✅ Configuration Firebase OK');
    return true;
  } catch (error) {
    console.error('❌ Erreur de configuration Firebase:', error);
    return false;
  }
};

/**
 * Fonction pour diagnostiquer les problèmes d'authentification
 */
export const diagnoseAuthIssues = () => {
  console.log('🔍 Diagnostic de l\'authentification...');
  
  // Vérifier que les services Firebase sont bien importés
  console.log('Auth service:', typeof auth);
  console.log('Firestore service:', typeof db);
  
  // Vérifier la configuration
  console.log('Project ID:', auth.app.options.projectId);
  console.log('Auth Domain:', auth.app.options.authDomain);
  
  // Instructions pour l'utilisateur
  console.log('📋 Vérifications à faire:');
  console.log('1. Firebase Authentication activé dans la console?');
  console.log('2. E-mail/mot de passe activé comme méthode de connexion?');
  console.log('3. Règles Firestore configurées pour les utilisateurs authentifiés?');
};