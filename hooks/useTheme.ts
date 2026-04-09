'use client';

import { useState, useEffect } from 'react';
import { fetchJSON } from '@/lib/csv-fetcher';
import { vacationDataUrl } from '@/lib/constants';
import { DEFAULT_THEME } from '@/lib/theme-utils';
import type { VacationTheme } from '@/types/theme';

export function useTheme(vacationId: string) {
  const [theme, setTheme] = useState<VacationTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJSON<VacationTheme>(vacationDataUrl(vacationId, 'theme.json'))
      .then(setTheme)
      .catch(() => setTheme(DEFAULT_THEME))
      .finally(() => setLoading(false));
  }, [vacationId]);

  return { theme, loading };
}
