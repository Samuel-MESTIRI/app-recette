# Configuration Firebase pour app-recette

## Problèmes résolus

### 1. ✅ AsyncStorage pour Firebase Auth
- **Problème** : Warning Firebase Auth persistance
- **Solution** : Installation de `@react-native-async-storage/async-storage`
- **Status** : ✅ Résolu

### 2. 🔄 Index Firestore requis
- **Problème** : Erreur index composite pour shoppingItems
- **Status** : 🔄 **Index en cours de construction** (normal, patientez quelques minutes)
- **Erreur actuelle** : `That index is currently building and cannot be used yet`

### 3. ✅ Validation des données ingrédients
- **Problème** : Erreur `name: undefined` et `quantity: undefined` lors de l'ajout d'ingrédients
- **Solution** : Validation robuste et nettoyage des valeurs `undefined` (Firestore ne les accepte pas)
- **Status** : ✅ Résolu

## Actions nécessaires

### Créer l'index Firestore
1. Ouvrir [Firebase Console](https://console.firebase.google.com/project/app-recette-311d8/firestore)
2. Aller dans "Indexes" 
3. Cliquer sur le lien d'erreur ou créer manuellement :
   - **Collection** : `shoppingItems`
   - **Champs** :
     - `userId` (Ascending)
     - `createdAt` (Descending)

### Fichiers de configuration créés
- `firestore.indexes.json` : Configuration des index pour déploiement automatique
- `firestore.rules` : Règles de sécurité pour les collections

### Commandes de déploiement (si Firebase CLI installé)
```bash
# Déployer les index
firebase deploy --only firestore:indexes

# Déployer les règles
firebase deploy --only firestore:rules
```

## Test de validation
- ✅ AsyncStorage : Plus de warning Auth
- 🔄 Index Firestore : En cours de construction (attendre ~5-10 minutes)
- ✅ Validation données : Plus d'erreur `name/quantity: undefined`

Une fois l'index finalisé, toutes les fonctionnalités de liste de courses fonctionneront parfaitement.

## Fonctionnalités implémentées
- ✅ Ajout d'ingrédients de recettes à la liste de courses
- ✅ Bouton "+" dans les cartes de recettes
- ✅ Bouton "Ajouter à ma liste de courses" dans le modal de recette
- ✅ Persistance Firebase Auth avec AsyncStorage
- 🔄 Index Firestore (en attente de création manuelle)