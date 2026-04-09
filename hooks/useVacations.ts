'use client';

import { useState, useEffect } from 'react';
import { fetchCSV } from '@/lib/csv-fetcher';
import { VACATIONS_CSV } from '@/lib/constants';
import type { Vacation } from '@/types/vacation';

export function useVacations() {
  const [vacations, setVacations] = useState<Vacation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCSV<Vacation>(VACATIONS_CSV)
      .then(setVacations)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { vacations, loading, error };
}

export function useVacation(id: string) {
  const { vacations, loading, error } = useVacations();
  const vacation = vacations?.find((v) => v.id === id) ?? null;
  return { vacation, loading, error };
}
