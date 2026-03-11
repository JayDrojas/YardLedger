import { useState } from 'react';
import { verifyAdminCredentials } from '../services/users';
import { useT } from './useT';

export function useAdminVerification() {
  const { t } = useT();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verify = async (
    email: string,
    password: string
  ): Promise<string | null> => {
    if (!email || !password) {
      setError(t.enterAdminCredentials);
      return null;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyAdminCredentials(email, password);
      if (!result.isAdmin || !result.userId) {
        setError(t.invalidCredentials);
        return null;
      }
      return result.userId;
    } catch {
      setError(t.verificationFailed);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError('');
    setLoading(false);
  };

  return { verify, loading, error, reset };
}
