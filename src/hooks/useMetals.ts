import { useState, useEffect, useCallback } from 'react';
import { fetchMetals } from '../services/metals';

interface Metal {
  id: string;
  name: string;
  price_per_lb: number;
  is_active: boolean;
}

export function useMetals() {
  const [metals, setMetals] = useState<Metal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMetals();
      setMetals(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { metals, loading, error, refresh: load };
}
