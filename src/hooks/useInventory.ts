import { useState, useEffect, useCallback } from 'react';
import { fetchInventory } from '../services/inventory';

export function useInventory() {
  const [inventory, setInventory] = useState<
    Awaited<ReturnType<typeof fetchInventory>>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInventory();
      setInventory(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { inventory, loading, error, refresh: load };
}
