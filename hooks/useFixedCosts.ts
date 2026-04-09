'use client';

import { useState, useEffect } from 'react';
import { fetchCSV } from '@/lib/csv-fetcher';
import { vacationDataUrl } from '@/lib/constants';
import type { FixedCostEntry } from '@/types/budget';

export function useFixedCosts(vacationId: string) {
  const [fixedCosts, setFixedCosts] = useState<FixedCostEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCSV<FixedCostEntry>(vacationDataUrl(vacationId, 'fixed_costs.csv'))
      .then(setFixedCosts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [vacationId]);

  return { fixedCosts, loading, error };
}
