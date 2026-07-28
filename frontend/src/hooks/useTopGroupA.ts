import { useState, useEffect } from 'react';
import { scoreService } from '../services/scoreService';
import type { TopGroupA } from '../services/scoreService';

export function useTopGroupA() {
  const [topGroupA, setTopGroupA] = useState<TopGroupA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTop = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await scoreService.getTopGroupA();
      setTopGroupA(response.data ?? []);
    } catch (err: any) {
      if (err.response && err.response.status >= 500) {
        setError('System error encountered. Please try again later.');
      } else {
        setError(err.message || 'Unable to load Top Group A data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTop();
  }, []);

  return { topGroupA, loading, error, refetch: fetchTop };
}
