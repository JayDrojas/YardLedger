import { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TransactionsStackParamList } from '../../navigation/MainNavigator';
import { useFocusEffect } from '@react-navigation/native';
import { useT } from '../../hooks/useT';
import { useReceipts } from '../../hooks/useReceipts';
import { useAppSelector, type RootState } from '../../store';
import { colors, spacing, fontSize } from '../../constants';

type Props = NativeStackScreenProps<
  TransactionsStackParamList,
  'TransactionsList'
>;

export default function TransactionsScreen({ navigation }: Props) {
  const { t } = useT();
  const profile = useAppSelector((state: RootState) => state.auth.profile);
  const isAdmin = profile?.role === 'admin';
  const { receipts, loading, refresh } = useReceipts(
    isAdmin ? undefined : profile?.id
  );

  // Refresh when screen comes into focus (e.g. after creating a receipt)
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={receipts}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={refresh}
        renderItem={({ item }) => (
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptNumber}>{item.receipt_number}</Text>
              <Text style={styles.receiptTotal}>
                ${Number(item.subtotal).toFixed(2)}
              </Text>
            </View>
            <Text style={styles.customerName}>{item.customer_name}</Text>
            <Text style={styles.receiptDate}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
            {item.line_items && (
              <Text style={styles.itemCount}>
                {item.line_items.length}{' '}
                {item.line_items.length === 1 ? 'item' : 'items'}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              color={colors.accent}
              style={{ marginTop: 100 }}
            />
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{t.noTransactions}</Text>
              <Text style={styles.emptySubtext}>{t.tapToRecordBuy}</Text>
            </View>
          )
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewTransaction')}
      >
        <Text style={styles.fabText}>{t.newBuy}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  receiptCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: 8,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  receiptNumber: {
    color: colors.accent,
    fontSize: fontSize.md,
    fontWeight: 'bold',
  },
  receiptTotal: {
    color: colors.accent,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  customerName: {
    color: colors.text,
    fontSize: fontSize.lg,
  },
  receiptDate: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  itemCount: {
    color: colors.textTertiary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.xl,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    color: colors.textTertiary,
    fontSize: fontSize.md,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    backgroundColor: colors.accent,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: colors.background,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
});
