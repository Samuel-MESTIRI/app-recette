import {
    User,
    changePassword,
    logOut,
    onAuthStateChange,
    signIn,
    signUp,
    updateUserProfile
} from '@/services/authService';
import { diagnoseAuthIssues, testFirebaseConfig } from '@/utils/firebase-test';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (name: string, email: string, photo?: string | null) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Observer l'état d'authentification Firebase
  useEffect(() => {
    let mounted = true;
    
    // Test de configuration au démarrage
    testFirebaseConfig().then(isConfigured => {
      if (!isConfigured) {
        diagnoseAuthIssues();
      }
    });
    
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (mounted) {
        console.log('🔄 Auth state change:', firebaseUser ? 'Connecté' : 'Déconnecté');
        setUser(firebaseUser);
        setIsLoading(false);
      }
    });

    // Timeout de sécurité : si Firebase ne répond pas en 3 secondes, 
    // considérer l'utilisateur comme déconnecté
    const timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.log('⏰ Timeout Firebase Auth - utilisateur considéré comme déconnecté');
        setUser(null);
        setIsLoading(false);
      }
    }, 5000); // Augmenté à 5 secondes

    // Cleanup function
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userData = await signIn(email, password);
      setUser(userData);
      return true;
    } catch (error: any) {
      console.error('Erreur de connexion:', error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userData = await signUp(name, email, password);
      setUser(userData);
      return true;
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de mise à jour du profil
  const updateProfile = async (name: string, email: string, photo?: string | null): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      await updateUserProfile(user.id, { name, email, photo });
      
      // Mettre à jour l'état local
      setUser({
        ...user,
        name,
        email,
        photo,
        updatedAt: new Date()
      });
      
      return true;
    } catch (error: any) {
      console.error('Erreur de mise à jour du profil:', error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de changement de mot de passe
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      return true;
    } catch (error: any) {
      console.error('Erreur de changement de mot de passe:', error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    console.log('🚪 Début de la déconnexion...');
    setIsLoading(true);
    logOut()
      .then(() => {
        console.log('✅ Déconnexion Firebase réussie');
        setUser(null);
      })
      .catch((error) => {
        console.error('❌ Erreur de déconnexion:', error);
        // Même en cas d'erreur, on déconnecte localement
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
        console.log('🔄 État de déconnexion mis à jour');
      });
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    updateProfile,
    updatePassword,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}