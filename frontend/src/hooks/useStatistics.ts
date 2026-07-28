import { useState, useEffect } from 'react';
import { scoreService } from '../services/scoreService';
import type { SubjectStat } from '../services/scoreService';

export function useStatistics() {
  const [stats, setStats] = useState<SubjectStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await scoreService.getStatistics();
      setStats(response.data ?? []);
    } catch (err: any) {
      setError(err.message || 'Unable to load score statistics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}
