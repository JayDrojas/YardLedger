import { useState, useEffect, useCallback } from 'react';
import { fetchSales } from '../services/sales';

export function useSales() {
  const [sales, setSales] = useState<Awaited<ReturnType<typeof fetchSales>>>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSales();
      setSales(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { sales, loading, error, refresh: load };
}
