import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { useT } from '../../hooks/useT';
import { useUserApproval } from '../../hooks/useUserApproval';
import type { PendingUser } from '../../types';
import { colors, spacing, fontSize } from '../../constants';

export default function UserApprovalScreen() {
  const { t } = useT();
  const {
    pendingUsers,
    activeUsers,
    loading,
    refresh,
    handleApprove,
    handleDeactivate,
    handlePromote,
  } = useUserApproval();

  const onApprove = async (userId: string) => {
    try {
      await handleApprove(userId);
    } catch (err) {
      Alert.alert(t.error, (err as Error).message);
    }
  };

  const onDeactivate = (userId: string) => {
    Alert.alert(t.deactivateUser, t.areYouSure, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.deactivate,
        style: 'destructive',
        onPress: async () => {
          try {
            await handleDeactivate(userId);
          } catch (err) {
            Alert.alert(t.error, (err as Error).message);
          }
        },
      },
    ]);
  };

  const onPromote = (userId: string) => {
    Alert.alert(t.promoteToAdmin, t.promoteAdminMessage, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.promote,
        onPress: async () => {
          try {
            await handlePromote(userId);
          } catch (err) {
            Alert.alert(t.error, (err as Error).message);
          }
        },
      },
    ]);
  };

  const renderUser = ({
    item,
    isPending,
  }: {
    item: PendingUser;
    isPending: boolean;
  }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userMeta}>
          {item.role} {item.is_active ? '' : '(pending)'}
        </Text>
      </View>
      <View style={styles.actions}>
        {isPending ? (
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => onApprove(item.id)}
          >
            <Text style={styles.approveButtonText}>{t.approve}</Text>
          </TouchableOpacity>
        ) : (
          <>
            {item.role !== 'admin' && (
              <TouchableOpacity
                style={styles.adminButton}
                onPress={() => onPromote(item.id)}
              >
                <Text style={styles.adminButtonText}>{t.admin}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.deactivateButton}
              onPress={() => onDeactivate(item.id)}
            >
              <Text style={styles.deactivateButtonText}>{t.deactivate}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={[...pendingUsers, ...activeUsers]}
      keyExtractor={(item) => item.id}
      refreshing={loading}
      onRefresh={refresh}
      ListHeaderComponent={
        pendingUsers.length > 0 ? (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t.pendingApproval} ({pendingUsers.length})
            </Text>
          </View>
        ) : null
      }
      renderItem={({ item }) =>
        renderUser({ item, isPending: !item.is_active })
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t.noUsersFound}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionHeader: {
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.warning,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.lg,
    borderRadius: 8,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  userMeta: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  approveButton: {
    backgroundColor: colors.success,
    borderRadius: 6,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  approveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSize.sm,
  },
  adminButton: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  adminButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: fontSize.sm,
  },
  deactivateButton: {
    backgroundColor: colors.danger,
    borderRadius: 6,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  deactivateButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSize.sm,
  },
  empty: {
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.xl,
  },
});
