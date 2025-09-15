import MigrationPanel from '@/components/migration-panel';
import { ThemedText } from '@/components/themed-text';
import { Button, Card, Input } from '@/components/ui';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, logout, updateProfile, updatePassword, isLoading } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    photo: user?.photo || null,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const pickImage = async () => {
    try {
      // Demander la permission d'accès à la galerie
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de votre permission pour accéder à vos photos.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Ouvrir la galerie d'images
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileData(prev => ({
          ...prev,
          photo: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const takePhoto = async () => {
    try {
      // Demander la permission d'accès à la caméra
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de votre permission pour accéder à l\'appareil photo.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Ouvrir l'appareil photo
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileData(prev => ({
          ...prev,
          photo: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Photo de profil',
      'Comment souhaitez-vous ajouter votre photo ?',
      [
        { text: 'Prendre une photo', onPress: takePhoto },
        { text: 'Choisir dans la galerie', onPress: pickImage },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!profileData.name.trim()) {
      Alert.alert('Erreur', 'Le nom ne peut pas être vide');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide');
      return;
    }

    try {
      const success = await updateProfile(profileData.name, profileData.email, profileData.photo);
      if (success) {
        setIsEditingProfile(false);
        Alert.alert('Succès', 'Profil mis à jour avec succès');
      } else {
        Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  const handleSavePassword = async () => {
    if (!passwordData.currentPassword) {
      Alert.alert('Erreur', 'Veuillez entrer votre mot de passe actuel');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Erreur', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Erreur', 'Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    try {
      const success = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      if (success) {
        setIsEditingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        Alert.alert('Succès', 'Mot de passe mis à jour avec succès');
      } else {
        Alert.alert('Erreur', 'Mot de passe actuel incorrect');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const updateProfileData = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const updatePasswordData = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Paramètres
          </ThemedText>
          <ThemedText type="caption" style={[styles.subtitle, { color: colors.textSecondary }]}>
            Gérez votre profil et vos préférences
          </ThemedText>
        </View>

        {/* Photo de profil */}
        <Card style={styles.photoCard}>
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={showImageOptions} style={styles.photoContainer}>
              {profileData.photo ? (
                <Image source={{ uri: profileData.photo }} style={styles.profileImage} />
              ) : (
                <View style={[styles.placeholderImage, { backgroundColor: colors.backgroundSecondary }]}>
                  <IconSymbol name="person" size={50} color={colors.textLight} />
                </View>
              )}
              <View style={[styles.photoOverlay, { backgroundColor: colors.primary }]}>
                <IconSymbol name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.photoInfo}>
              <ThemedText type="subtitle" style={styles.userName}>
                {user?.name || 'Utilisateur'}
              </ThemedText>
              <TouchableOpacity onPress={showImageOptions}>
                <ThemedText type="link" style={[styles.changePhoto, { color: colors.primary }]}>
                  Modifier la photo
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Informations du profil */}
        <Card style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Informations personnelles
            </ThemedText>
            <TouchableOpacity 
              onPress={() => setIsEditingProfile(!isEditingProfile)}
              style={styles.editButton}
            >
              <IconSymbol 
                name={isEditingProfile ? "xmark" : "pencil"} 
                size={18} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.profileForm}>
            <Input
              label="Nom complet"
              value={profileData.name}
              onChangeText={(value) => updateProfileData('name', value)}
              editable={isEditingProfile}
              leftIcon={<IconSymbol name="person" size={20} color={colors.textLight} />}
              containerStyle={styles.inputContainer}
            />

            <Input
              label="Email"
              value={profileData.email}
              onChangeText={(value) => updateProfileData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={isEditingProfile}
              leftIcon={<IconSymbol name="envelope" size={20} color={colors.textLight} />}
              containerStyle={styles.inputContainer}
            />

            {isEditingProfile && (
              <View style={styles.buttonRow}>
                <Button
                  title="Annuler"
                  variant="outline"
                  onPress={() => {
                    setIsEditingProfile(false);
                    setProfileData({
                      name: user?.name || '',
                      email: user?.email || '',
                      photo: user?.photo || null,
                    });
                  }}
                  style={styles.halfButton}
                />
                <Button
                  title={isLoading ? "Sauvegarde..." : "Sauvegarder"}
                  onPress={handleSaveProfile}
                  disabled={isLoading}
                  style={styles.halfButton}
                />
              </View>
            )}
          </View>
        </Card>

        {/* Mot de passe */}
        <Card style={styles.passwordCard}>
          <View style={styles.cardHeader}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Sécurité
            </ThemedText>
            <TouchableOpacity 
              onPress={() => setIsEditingPassword(!isEditingPassword)}
              style={styles.editButton}
            >
              <IconSymbol 
                name={isEditingPassword ? "xmark" : "pencil"} 
                size={18} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          </View>

          {!isEditingPassword ? (
            <View style={styles.passwordInfo}>
              <View style={styles.passwordRow}>
                <IconSymbol name="lock" size={20} color={colors.textLight} />
                <ThemedText style={[styles.passwordText, { color: colors.textSecondary }]}>
                  Mot de passe
                </ThemedText>
                <ThemedText style={[styles.passwordValue, { color: colors.textSecondary }]}>
                  ••••••••
                </ThemedText>
              </View>
            </View>
          ) : (
            <View style={styles.passwordForm}>
              <Input
                label="Mot de passe actuel"
                value={passwordData.currentPassword}
                onChangeText={(value) => updatePasswordData('currentPassword', value)}
                secureTextEntry={!showPasswords.current}
                leftIcon={<IconSymbol name="lock" size={20} color={colors.textLight} />}
                rightIcon={
                  <TouchableOpacity onPress={() => togglePasswordVisibility('current')}>
                    <IconSymbol 
                      name={showPasswords.current ? "eye.slash" : "eye"} 
                      size={20} 
                      color={colors.textLight}
                    />
                  </TouchableOpacity>
                }
                containerStyle={styles.inputContainer}
              />

              <Input
                label="Nouveau mot de passe"
                value={passwordData.newPassword}
                onChangeText={(value) => updatePasswordData('newPassword', value)}
                secureTextEntry={!showPasswords.new}
                leftIcon={<IconSymbol name="lock" size={20} color={colors.textLight} />}
                rightIcon={
                  <TouchableOpacity onPress={() => togglePasswordVisibility('new')}>
                    <IconSymbol 
                      name={showPasswords.new ? "eye.slash" : "eye"} 
                      size={20} 
                      color={colors.textLight}
                    />
                  </TouchableOpacity>
                }
                containerStyle={styles.inputContainer}
              />

              <Input
                label="Confirmer le mot de passe"
                value={passwordData.confirmPassword}
                onChangeText={(value) => updatePasswordData('confirmPassword', value)}
                secureTextEntry={!showPasswords.confirm}
                leftIcon={<IconSymbol name="lock" size={20} color={colors.textLight} />}
                rightIcon={
                  <TouchableOpacity onPress={() => togglePasswordVisibility('confirm')}>
                    <IconSymbol 
                      name={showPasswords.confirm ? "eye.slash" : "eye"} 
                      size={20} 
                      color={colors.textLight}
                    />
                  </TouchableOpacity>
                }
                containerStyle={styles.inputContainer}
                error={
                  passwordData.confirmPassword.length > 0 && 
                  passwordData.newPassword !== passwordData.confirmPassword 
                    ? "Les mots de passe ne correspondent pas" 
                    : undefined
                }
              />

              <View style={styles.buttonRow}>
                <Button
                  title="Annuler"
                  variant="outline"
                  onPress={() => {
                    setIsEditingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  style={styles.halfButton}
                />
                <Button
                  title={isLoading ? "Sauvegarde..." : "Modifier"}
                  onPress={handleSavePassword}
                  disabled={isLoading}
                  style={styles.halfButton}
                />
              </View>
            </View>
          )}
        </Card>

        {/* Actions */}
        <Card style={styles.actionsCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Actions
          </ThemedText>
          
          <Button
            title="🚪 Se déconnecter"
            variant="outline"
            onPress={handleLogout}
            fullWidth
            style={styles.logoutButton}
          />
        </Card>

        {/* Panel de migration des données */}
        <MigrationPanel />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    lineHeight: 20,
  },
  photoCard: {
    marginBottom: Spacing.lg,
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  photoContainer: {
    position: 'relative',
    marginRight: Spacing.lg,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  photoInfo: {
    flex: 1,
  },
  userName: {
    marginBottom: Spacing.xs,
  },
  changePhoto: {
    fontWeight: '600',
  },
  profileCard: {
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    flex: 1,
  },
  editButton: {
    padding: Spacing.sm,
    marginRight: -Spacing.sm,
  },
  profileForm: {
    gap: Spacing.md,
  },
  inputContainer: {
    marginBottom: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  halfButton: {
    flex: 1,
  },
  passwordCard: {
    marginBottom: Spacing.lg,
  },
  passwordInfo: {
    marginTop: Spacing.sm,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  passwordText: {
    flex: 1,
  },
  passwordValue: {
    fontFamily: 'monospace',
  },
  passwordForm: {
    gap: Spacing.md,
  },
  actionsCard: {
    marginBottom: Spacing.lg,
  },
  logoutButton: {
    marginTop: Spacing.md,
  },
});