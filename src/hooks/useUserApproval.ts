import { useState, useEffect, useCallback } from 'react';
import type { PendingUser } from '../types';
import {
  fetchAllUsers,
  approveUser,
  deactivateUser,
  promoteToAdmin,
} from '../services/users';

export function useUserApproval() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pendingUsers = users.filter((u) => !u.is_active);
  const activeUsers = users.filter((u) => u.is_active);

  const handleApprove = async (userId: string) => {
    await approveUser(userId);
    await load();
  };

  const handleDeactivate = async (userId: string) => {
    await deactivateUser(userId);
    await load();
  };

  const handlePromote = async (userId: string) => {
    await promoteToAdmin(userId);
    await load();
  };

  return {
    users,
    pendingUsers,
    activeUsers,
    loading,
    error,
    refresh: load,
    handleApprove,
    handleDeactivate,
    handlePromote,
  };
}
