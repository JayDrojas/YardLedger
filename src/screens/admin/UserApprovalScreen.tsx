import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { supabase } from '../../config/supabase';
import { useT } from '../../hooks/useT';
import { colors, spacing, fontSize } from '../../constants';

interface PendingUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function UserApprovalScreen() {
  const { t } = useT();
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert(t.error, error.message);
    } else {
      setUsers(data ?? []);
    }
    setLoading(false);
  }, [t.error]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleApprove = async (userId: string) => {
    const { error } = await supabase
      .from('users')
      .update({ is_active: true })
      .eq('id', userId);

    if (error) {
      Alert.alert(t.error, error.message);
    } else {
      loadUsers();
    }
  };

  const handleDeactivate = async (userId: string) => {
    Alert.alert(t.deactivateUser, t.areYouSure, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.deactivate,
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase
            .from('users')
            .update({ is_active: false })
            .eq('id', userId);

          if (error) {
            Alert.alert(t.error, error.message);
          } else {
            loadUsers();
          }
        },
      },
    ]);
  };

  const handleSetAdmin = async (userId: string) => {
    Alert.alert(t.promoteToAdmin, t.promoteAdminMessage, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.promote,
        onPress: async () => {
          const { error } = await supabase
            .from('users')
            .update({ role: 'admin' })
            .eq('id', userId);

          if (error) {
            Alert.alert(t.error, error.message);
          } else {
            loadUsers();
          }
        },
      },
    ]);
  };

  const pendingUsers = users.filter((u) => !u.is_active);
  const activeUsers = users.filter((u) => u.is_active);

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
            onPress={() => handleApprove(item.id)}
          >
            <Text style={styles.approveButtonText}>{t.approve}</Text>
          </TouchableOpacity>
        ) : (
          <>
            {item.role !== 'admin' && (
              <TouchableOpacity
                style={styles.adminButton}
                onPress={() => handleSetAdmin(item.id)}
              >
                <Text style={styles.adminButtonText}>{t.admin}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.deactivateButton}
              onPress={() => handleDeactivate(item.id)}
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
      onRefresh={loadUsers}
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
