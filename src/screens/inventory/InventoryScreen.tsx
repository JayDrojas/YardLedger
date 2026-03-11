import { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useT } from '../../hooks/useT';
import { useInventory } from '../../hooks/useInventory';
import { RefreshableList } from '../../components';
import { colors, spacing, fontSize } from '../../constants';
import { calculateInventoryValue } from '../../utils/calculations';

export default function InventoryScreen() {
  const { t } = useT();
  const { inventory, loading, refresh } = useInventory();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <View style={styles.container}>
      <RefreshableList
        data={inventory}
        keyExtractor={(item) => item.id}
        loading={loading}
        onRefresh={refresh}
        emptyTitle={t.noInventory}
        emptySubtitle={t.inventoryAutoUpdate}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.metalName}>{item.metal_name}</Text>
              <Text style={styles.weight}>
                {Number(item.weight).toFixed(2)} lbs
              </Text>
            </View>
            <Text style={styles.detail}>
              Avg cost: ${Number(item.avg_cost_per_lb).toFixed(4)}/lb
            </Text>
            <Text style={styles.detail}>
              Value: $
              {calculateInventoryValue(
                Number(item.weight),
                Number(item.avg_cost_per_lb)
              ).toFixed(2)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  metalName: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  weight: {
    color: colors.accent,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  detail: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});
