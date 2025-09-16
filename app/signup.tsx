import { ThemedText } from '@/components/themed-text';
import { Button, Card, Input, showErrorAlert, useCustomAlert } from '@/components/ui';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { signup, isLoading } = useAuth();
  const { showAlert, AlertComponent } = useCustomAlert();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    // Validation des champs
    if (!formData.name.trim()) {
      showErrorAlert(showAlert, 'Erreur', 'Veuillez entrer votre nom');
      return;
    }

    if (!formData.email.trim()) {
      showErrorAlert(showAlert, 'Erreur', 'Veuillez entrer votre email');
      return;
    }

    if (formData.password.length < 6) {
      showErrorAlert(showAlert, 'Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showErrorAlert(showAlert, 'Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showErrorAlert(showAlert, 'Erreur', 'Veuillez entrer un email valide');
      return;
    }

    try {
      const success = await signup(formData.name, formData.email, formData.password);
      if (!success) {
        showErrorAlert(
          showAlert,
          'Erreur d\'inscription',
          'Un compte avec cet email existe déjà ou une erreur est survenue.'
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

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = 
    formData.name.length > 0 && 
    formData.email.length > 0 && 
    formData.password.length >= 6 && 
    formData.confirmPassword.length >= 6;

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
          {/* Header avec retour */}
          <View style={styles.headerNav}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <IconSymbol 
                name="arrow.left" 
                size={24} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          </View>

          {/* Logo et titre */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
              <ThemedText style={styles.logoText}>🍽️</ThemedText>
            </View>
            <ThemedText type="title" style={styles.title}>
              Créer un compte
            </ThemedText>
            <ThemedText type="caption" style={[styles.subtitle, { color: colors.textSecondary }]}>
              Rejoignez la communauté des passionnés de cuisine
            </ThemedText>
          </View>

          {/* Formulaire d'inscription */}
          <Card style={styles.formCard}>
            <View style={styles.form}>
              <Input
                label="Nom complet"
                placeholder="Votre nom"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                autoCapitalize="words"
                autoComplete="name"
                leftIcon={
                  <IconSymbol 
                    name="person" 
                    size={20} 
                    color={colors.textLight} 
                  />
                }
                containerStyle={styles.inputContainer}
              />

              <Input
                label="Email"
                placeholder="votre@email.com"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
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
                placeholder="Au moins 6 caractères"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
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

              <Input
                label="Confirmer le mot de passe"
                placeholder="Répétez votre mot de passe"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
                leftIcon={
                  <IconSymbol 
                    name="lock" 
                    size={20} 
                    color={colors.textLight} 
                  />
                }
                rightIcon={
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <IconSymbol 
                      name={showConfirmPassword ? "eye.slash" : "eye"} 
                      size={20} 
                      color={colors.textLight}
                    />
                  </TouchableOpacity>
                }
                containerStyle={styles.inputContainer}
                error={
                  formData.confirmPassword.length > 0 && 
                  formData.password !== formData.confirmPassword 
                    ? "Les mots de passe ne correspondent pas" 
                    : undefined
                }
              />

              <Button
                title={isLoading ? "Création..." : "Créer mon compte"}
                onPress={handleSignup}
                disabled={!isFormValid || isLoading}
                fullWidth
                style={styles.signupButton}
              />
            </View>
          </Card>

          {/* Lien vers connexion */}
          <View style={styles.footer}>
            <ThemedText type="caption" style={{ color: colors.textSecondary }}>
              Déjà un compte ?
            </ThemedText>
            <TouchableOpacity onPress={() => router.replace('/login' as any)}>
              <ThemedText 
                type="link" 
                style={[styles.loginLink, { color: colors.primary }]}
              >
                Se connecter
              </ThemedText>
            </TouchableOpacity>
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
    padding: Spacing.lg,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
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
  signupButton: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
  },
  loginLink: {
    fontWeight: '600',
  },
});