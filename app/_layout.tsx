import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from '@/contexts/app-context';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import LoadingScreen from './loading';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('🔄 Auth state changed:', { isAuthenticated, isLoading });
    if (!isLoading) {
      if (isAuthenticated) {
        // Rediriger vers l'app si authentifié
        console.log('✅ Utilisateur connecté - redirection vers tabs...');
        router.replace('/(tabs)' as any);
      } else {
        // Rediriger vers login si pas authentifié
        console.log('❌ Utilisateur déconnecté - redirection vers login...');
        router.replace('/login' as any);
      }
    } else {
      console.log('⏳ Chargement en cours...');
    }
  }, [isAuthenticated, isLoading]);

  // Afficher l'écran de loading pendant la vérification
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName={isAuthenticated ? "(tabs)" : "login"}>
        <Stack.Screen name="loading" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Nouvelle Recette' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <RootLayoutNav />
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
