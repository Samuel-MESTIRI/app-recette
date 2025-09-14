# App Recette 🍽️

Application mobile de recettes créée avec [Expo](https://expo.dev) et React Native.

## Installation

1. Installer les dépendances

   ```bash
   npm install
   ```

2. Démarrer l'application

   ```bash
   npx expo start
   ```

Dans la sortie, vous trouverez des options pour ouvrir l'app dans :

- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) sur votre téléphone

## Développement

Vous pouvez commencer à développer en éditant les fichiers dans le répertoire **app**. Ce projet utilise le [routage basé sur les fichiers](https://docs.expo.dev/router/introduction).

### Structure du projet

- `app/(tabs)/index.tsx` - Écran principal (Mes Recettes)
- `app/(tabs)/explore.tsx` - Écran d'exploration des recettes  
- `app/modal.tsx` - Modal pour ajouter une nouvelle recette
- `components/` - Composants réutilisables
- `constants/` - Constantes (thèmes, couleurs)

## En savoir plus

Pour en savoir plus sur le développement avec Expo :

- [Documentation Expo](https://docs.expo.dev/)
- [Tutoriel Expo](https://docs.expo.dev/tutorial/introduction/)
