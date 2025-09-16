import { ThemedText } from '@/components/themed-text';
import { Button, Card, Input, showErrorAlert, useCustomAlert } from '@/components/ui';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, FontSizes, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { login, isLoading } = useAuth();
  const { showAlert, AlertComponent } = useCustomAlert();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const success = await login(email, password);
      if (!success) {
        showErrorAlert(
          showAlert,
          'Erreur de connexion',
          'Vérifiez vos identifiants et réessayez.'
        );
      }
      // La navigation se fait automatiquement via le layout quand isAuthenticated change
    } catch (error) {
      showErrorAlert(
        showAlert,
        'Erreur',
        'Une erreur est survenue. Veuillez réessayer.'
      );
    }
  };

  const isFormValid = email.length > 0 && password.length >= 6;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo et titre */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
              <ThemedText style={styles.logoText}>🍽️</ThemedText>
            </View>
            <ThemedText type="title" style={styles.title}>
              Mes Recettes
            </ThemedText>
            <ThemedText type="caption" style={[styles.subtitle, { color: colors.textSecondary }]}>
              Connectez-vous pour accéder à vos recettes
            </ThemedText>
          </View>

          {/* Formulaire de connexion */}
          <Card style={styles.formCard}>
            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="votre@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                leftIcon={
                  <IconSymbol 
                    name="envelope" 
                    size={20} 
                    color={colors.textLight} 
                  />
                }
                containerStyle={styles.inputContainer}
              />

              <Input
                label="Mot de passe"
                placeholder="Votre mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
                leftIcon={
                  <IconSymbol 
                    name="lock" 
                    size={20} 
                    color={colors.textLight} 
                  />
                }
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <IconSymbol 
                      name={showPassword ? "eye.slash" : "eye"} 
                      size={20} 
                      color={colors.textLight}
                    />
                  </TouchableOpacity>
                }
                containerStyle={styles.inputContainer}
              />

              <Button
                title={isLoading ? "Connexion..." : "Se connecter"}
                onPress={handleLogin}
                disabled={!isFormValid || isLoading}
                fullWidth
                style={styles.loginButton}
              />
            </View>
          </Card>

          {/* Options supplémentaires */}
          <View style={styles.footer}>
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <ThemedText type="caption" style={[styles.dividerText, { color: colors.textLight }]}>
                ou
              </ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <Button
              title="Créer un compte"
              variant="outline"
              onPress={() => {
                router.push('/signup' as any);
              }}
              fullWidth
              style={styles.registerButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert Component */}
      {AlertComponent}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    marginBottom: Spacing.xl,
  },
  form: {
    gap: Spacing.lg,
  },
  inputContainer: {
    marginBottom: 0,
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.sm,
  },
  registerButton: {
    marginBottom: Spacing.lg,
  },
});