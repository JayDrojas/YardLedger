import { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useT } from '../../hooks/useT';
import { useSales } from '../../hooks/useSales';
import { RefreshableList } from '../../components';
import { colors, spacing, fontSize } from '../../constants';
import { calculateTotalProfit } from '../../utils/calculations';

export default function SalesScreen() {
  const { t } = useT();
  const { sales, loading, refresh } = useSales();
  const totalProfit = calculateTotalProfit(sales);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <View style={styles.container}>
      {sales.length > 0 && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryLabel}>Total Profit</Text>
          <Text
            style={[
              styles.summaryValue,
              totalProfit < 0 && styles.summaryNegative,
            ]}
          >
            ${totalProfit.toFixed(2)}
          </Text>
        </View>
      )}
      <RefreshableList
        data={sales}
        keyExtractor={(item) => item.id}
        loading={loading}
        onRefresh={refresh}
        emptyTitle={t.noSales}
        emptySubtitle={t.recordSalesProfit}
        renderItem={({ item }) => {
          const profit = Number(item.profit);
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.metalName}>{item.metal_name}</Text>
                <Text
                  style={[styles.profit, profit < 0 && styles.profitNegative]}
                >
                  ${profit.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.detail}>
                {Number(item.weight).toFixed(2)} lbs @ $
                {Number(item.sale_price_per_lb).toFixed(4)}/lb
              </Text>
              <Text style={styles.detail}>
                Revenue: ${Number(item.total_revenue).toFixed(2)} | Cost basis:
                ${Number(item.cost_basis_per_lb).toFixed(4)}/lb
              </Text>
              {item.buyer_name ? (
                <Text style={styles.detail}>Buyer: {item.buyer_name}</Text>
              ) : null}
              <Text style={styles.date}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
  },
  summaryValue: {
    color: colors.success,
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
  },
  summaryNegative: {
    color: colors.danger,
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
  profit: {
    color: colors.success,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  profitNegative: {
    color: colors.danger,
  },
  detail: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  date: {
    color: colors.textTertiary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});
