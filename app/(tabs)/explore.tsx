import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useShopping } from '@/hooks/useShopping';
import { ShoppingItem } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
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
    updateItem,
    removeItem,
    clearList,
    getStats
  } = useShopping();
  
  const [refreshing, setRefreshing] = useState(false);

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
      await updateItem(item.id!, { status: newStatus });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le statut de cet élément');
    }
  };

  const deleteItem = async (item: ShoppingItem) => {
    Alert.alert(
      'Supprimer l\'élément',
      `Êtes-vous sûr de vouloir supprimer "${item.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeItem(item.id!);
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer cet élément');
            }
          }
        }
      ]
    );
  };

  const clearAllItems = () => {
    Alert.alert(
      'Vider la liste',
      'Êtes-vous sûr de vouloir supprimer tous les éléments ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Vider',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearList();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de vider la liste');
            }
          }
        }
      ]
    );
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

  const stats = getStats();
  const pendingItems = items.filter(item => item.status === 'pending');
  const purchasedItems = items.filter(item => item.status === 'purchased');

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

      {/* Statistiques */}
      {items.length > 0 && (
        <View style={[styles.statsContainer, { backgroundColor: colors.backgroundWhite, borderBottomColor: colors.border }]}>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: colors.primary }]}>
              {pendingItems.length}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
              À acheter
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: colors.success }]}>
              {purchasedItems.length}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
              Achetés
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: colors.text }]}>
              {Math.round(stats.completionRate)}%
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
              Terminé
            </ThemedText>
          </View>
        </View>
      )}

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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs / 2,
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
});