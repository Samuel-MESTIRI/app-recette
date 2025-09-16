import { ThemedText } from '@/components/themed-text';
import { showConfirmAlert, showErrorAlert, useCustomAlert } from '@/components/ui';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useShopping } from '@/hooks/useShopping';
import { ShoppingItem } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const {
    items,
    loading,
    error,
    fetchItems,
    updateItemOptimistic,
    removeItem,
    clearList,
    addManualItem
  } = useShopping();
  const { showAlert, AlertComponent } = useCustomAlert();
  
  const [refreshing, setRefreshing] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Se rafraîchir chaque fois qu'on va sur cet onglet
  useFocusEffect(
    useCallback(() => {
      console.log('🛒 Onglet liste de courses focalisé - actualisation des données');
      fetchItems();
    }, []) // Dependency array vide pour éviter la boucle
  );

  useEffect(() => {
    console.log('🛒 Items mis à jour:', items?.length || 0, 'éléments');
    if (items?.length > 0) {
      console.log('🛒 Premier élément:', items[0]);
    }
  }, [items]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  const toggleItemStatus = async (item: ShoppingItem) => {
    try {
      const newStatus = item.status === 'pending' ? 'purchased' : 'pending';
      await updateItemOptimistic(item.id!, { status: newStatus });
    } catch (error) {
      // On supprime l'alerte d'erreur pour ne pas déranger l'utilisateur
      console.error('Erreur lors du toggle:', error);
    }
  };

  const deleteItem = async (item: ShoppingItem) => {
    showConfirmAlert(
      showAlert,
      'Supprimer l\'élément',
      `Êtes-vous sûr de vouloir supprimer "${item.name}" ?`,
      async () => {
        try {
          await removeItem(item.id!);
        } catch (error) {
          showErrorAlert(showAlert, 'Erreur', 'Impossible de supprimer cet élément');
        }
      }
    );
  };

  const clearAllItems = () => {
    showConfirmAlert(
      showAlert,
      'Vider la liste',
      'Êtes-vous sûr de vouloir supprimer tous les éléments ?',
      async () => {
        try {
          await clearList();
        } catch (error) {
          showErrorAlert(showAlert, 'Erreur', 'Impossible de vider la liste');
        }
      }
    );
  };

  const addNewItem = async () => {
    if (!newItemName.trim()) {
      showErrorAlert(showAlert, 'Erreur', 'Veuillez saisir un nom pour l\'élément');
      return;
    }

    setIsAddingItem(true);
    try {
      const itemToAdd = newItemName.trim();
      await addManualItem(itemToAdd);
      setNewItemName(''); // Vider le champ après ajout
      // Pas d'alert de succès - l'ajout se fait silencieusement
    } catch (error) {
      showErrorAlert(showAlert, 'Erreur', 'Impossible d\'ajouter cet élément');
      console.error('Erreur lors de l\'ajout:', error);
    } finally {
      setIsAddingItem(false);
    }
  };

  const renderShoppingItem = ({ item }: { item: ShoppingItem }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.backgroundWhite, borderColor: colors.border }]}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => toggleItemStatus(item)}
        activeOpacity={0.7}
      >
        {/* Checkbox */}
        <View style={[
          styles.checkbox,
          {
            backgroundColor: item.status === 'purchased' ? colors.success : 'transparent',
            borderColor: item.status === 'purchased' ? colors.success : colors.border
          }
        ]}>
          {item.status === 'purchased' && (
            <IconSymbol name="checkmark" size={16} color="white" />
          )}
        </View>

        {/* Contenu principal */}
        <View style={styles.itemDetails}>
          <ThemedText
            style={[
              styles.itemName,
              { color: item.status === 'purchased' ? colors.textSecondary : colors.text },
              item.status === 'purchased' && styles.strikethrough
            ]}
          >
            {item.name}
          </ThemedText>
          
          {/* Quantité et unité */}
          {(item.quantity || item.unit) && (
            <ThemedText style={[styles.itemQuantity, { color: colors.textSecondary }]}>
              {item.quantity && `${item.quantity}`} {item.unit}
            </ThemedText>
          )}
          
          {/* Source (recette) */}
          {item.source === 'recipe' && item.recipeTitle && (
            <View style={[styles.sourceBadge, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="book.closed" size={12} color={colors.primary} />
              <ThemedText style={[styles.sourceText, { color: colors.primary }]}>
                {item.recipeTitle}
              </ThemedText>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Bouton supprimer */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item)}
        activeOpacity={0.7}
      >
        <IconSymbol name="trash" size={16} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.backgroundWhite, borderBottomColor: colors.border }]}>
        <ThemedText type="title" style={styles.headerTitle}>
          Ma liste de courses
        </ThemedText>
        {items.length > 0 && (
          <TouchableOpacity
            onPress={clearAllItems}
            style={[styles.clearButton, { backgroundColor: colors.error + '20' }]}
            activeOpacity={0.7}
          >
            <IconSymbol name="trash" size={16} color={colors.error} />
            <ThemedText style={[styles.clearButtonText, { color: colors.error }]}>
              Vider
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Champ d'ajout d'élément */}
      <View style={[styles.addItemContainer, { backgroundColor: colors.backgroundWhite, borderBottomColor: colors.border }]}>
        <View style={styles.addItemRow}>
          <TextInput
            style={[
              styles.addItemInput,
              { 
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text
              }
            ]}
            placeholder="Ajouter un élément (ex: lait, pain...)"
            placeholderTextColor={colors.textSecondary}
            value={newItemName}
            onChangeText={setNewItemName}
            onSubmitEditing={addNewItem}
            returnKeyType="done"
            editable={!isAddingItem}
          />
          <TouchableOpacity
            style={[
              styles.addItemButton,
              { 
                backgroundColor: newItemName.trim() ? colors.primary : colors.border,
                opacity: isAddingItem ? 0.5 : 1
              }
            ]}
            onPress={addNewItem}
            disabled={!newItemName.trim() || isAddingItem}
            activeOpacity={0.7}
          >
            {isAddingItem ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <IconSymbol name="plus" size={16} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            Chargement de votre liste...
          </ThemedText>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={24} color={colors.error} />
          <ThemedText style={[styles.errorText, { color: colors.error }]}>
            {error}
          </ThemedText>
          <TouchableOpacity
            onPress={() => fetchItems()}
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.retryButtonText}>
              Réessayer
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Liste des éléments */}
      {!loading && !error && (
        <>
          {items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="cart" size={48} color={colors.textLight} />
              <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
                Votre liste est vide
              </ThemedText>
              <ThemedText style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Ajoutez des ingrédients depuis vos recettes ou créez-en manuellement
              </ThemedText>
            </View>
          ) : (
            <FlatList
              data={items}
              renderItem={renderShoppingItem}
              keyExtractor={(item) => item.id || ''}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                />
              }
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {/* Custom Alert Component */}
      {AlertComponent}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    flex: 1,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs / 2,
  },
  clearButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.base,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  errorText: {
    fontSize: FontSizes.base,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: 'white',
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: FontSizes.base,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  itemDetails: {
    flex: 1,
    gap: Spacing.xs / 2,
  },
  itemName: {
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  itemQuantity: {
    fontSize: FontSizes.sm,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs / 2,
    marginTop: Spacing.xs / 2,
  },
  sourceText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  deleteButton: {
    padding: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItemContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  addItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  addItemInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    fontSize: FontSizes.base,
  },
  addItemButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});