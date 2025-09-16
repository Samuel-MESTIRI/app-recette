import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';

export type ThemePreference = 'auto' | 'light' | 'dark';
export type ActiveTheme = 'light' | 'dark';

// Hook personnalisé pour gérer le thème avec préférences utilisateur
export function useTheme() {
  const systemColorScheme = useColorScheme();
  const { user, updateTheme } = useAuth();
  
  // Récupérer la préférence depuis le profil utilisateur (défaut: 'auto')
  const [themePreference, setThemePreference] = useState<ThemePreference>('auto');
  
  // Calculer le thème actif
  const activeTheme: ActiveTheme = themePreference === 'auto' 
    ? (systemColorScheme ?? 'light')
    : themePreference;

  // Charger la préférence depuis le profil utilisateur
  useEffect(() => {
    if (user?.preferences?.theme) {
      setThemePreference(user.preferences.theme as ThemePreference);
    }
  }, [user]);

  // Fonction pour changer le thème
  const changeTheme = async (newTheme: ThemePreference) => {
    const success = await updateTheme(newTheme);
    if (success) {
      setThemePreference(newTheme);
    }
    return success;
  };

  return {
    themePreference,
    activeTheme,
    changeTheme,
    systemColorScheme,
  };
}