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
      setError(err.message || 'Không thể tải dữ liệu top khối A.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTop();
  }, []);

  return { topGroupA, loading, error, refetch: fetchTop };
}
