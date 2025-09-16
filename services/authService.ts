import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  User as FirebaseUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.config';

export interface User {
  id: string;
  email: string;
  name: string;
  photo?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  preferences?: {
    theme?: 'auto' | 'light' | 'dark';
    notifications?: boolean;
  };
}

const USERS_COLLECTION = 'users';

// Créer le profil utilisateur dans Firestore
const createUserProfile = async (firebaseUser: FirebaseUser, additionalData?: any): Promise<User> => {
  const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = firebaseUser;
    const userData = {
      name: additionalData?.name || displayName || 'Utilisateur',
      email: email || '',
      photo: photoURL || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...additionalData
    };

    try {
      await setDoc(userRef, userData);
      return {
        id: firebaseUser.uid,
        ...userData
      };
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error);
      throw error;
    }
  } else {
    return {
      id: firebaseUser.uid,
      ...userSnap.data()
    } as User;
  }
};

// Récupérer le profil utilisateur depuis Firestore
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        id: userId,
        ...userSnap.data()
      } as User;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return null;
  }
};

// Inscription avec email et mot de passe
export const signUp = async (name: string, email: string, password: string): Promise<User> => {
  try {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Mettre à jour le displayName dans Firebase Auth
    await updateProfile(firebaseUser, { displayName: name });
    
    // Créer le profil dans Firestore
    const user = await createUserProfile(firebaseUser, { name });
    
    return user;
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Connexion avec email et mot de passe
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    
    // Récupérer ou créer le profil utilisateur
    const user = await createUserProfile(firebaseUser);
    
    return user;
  } catch (error: any) {
    console.error('Erreur lors de la connexion:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Déconnexion
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
};

// Mettre à jour le profil utilisateur
export const updateUserProfile = async (
  userId: string, 
  updates: { name?: string; email?: string; photo?: string | null }
): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });

    // Mettre à jour aussi dans Firebase Auth si nécessaire
    if (auth.currentUser && (updates.name || updates.photo !== undefined)) {
      await updateProfile(auth.currentUser, {
        displayName: updates.name,
        photoURL: updates.photo
      });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

// Changer le mot de passe
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('Utilisateur non connecté');
    }

    // Réauthentification requise pour changer le mot de passe
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
    
    // Changer le mot de passe
    await updatePassword(auth.currentUser, newPassword);
  } catch (error: any) {
    console.error('Erreur lors du changement de mot de passe:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Réinitialiser le mot de passe
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Erreur lors de la réinitialisation:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Observer l'état d'authentification
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  try {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const user = await getUserProfile(firebaseUser.uid);
          callback(user);
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Firebase Auth:', error);
    // Si Firebase Auth n'est pas configuré, retourner immédiatement null
    callback(null);
    return () => {}; // Fonction de nettoyage vide
  }
};

// Messages d'erreur en français
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Cette adresse email est déjà utilisée';
    case 'auth/invalid-email':
      return 'Adresse email invalide';
    case 'auth/operation-not-allowed':
      return 'Opération non autorisée';
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé';
    case 'auth/user-not-found':
      return 'Aucun compte trouvé avec cette adresse email';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect';
    case 'auth/invalid-credential':
      return 'Identifiants invalides';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Réessayez plus tard';
    case 'auth/requires-recent-login':
      return 'Cette action nécessite une reconnexion récente';
    default:
      return 'Une erreur est survenue. Veuillez réessayer';
  }
};

// Mettre à jour les préférences utilisateur
export const updateUserPreferences = async (
  userId: string, 
  preferences: Partial<User['preferences']>
): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      preferences: preferences,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des préférences:', error);
    throw error;
  }
};