'use client';

import { useState, useEffect } from 'react';
import { fetchCSV } from '@/lib/csv-fetcher';
import { vacationDataUrl } from '@/lib/constants';
import type { ItineraryEntry, ItineraryDay } from '@/types/itinerary';

export function useItinerary(vacationId: string) {
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCSV<ItineraryEntry>(vacationDataUrl(vacationId, 'itinerary.csv'))
      .then((entries) => {
        const grouped = new Map<number, ItineraryEntry[]>();
        for (const entry of entries) {
          const day = Number(entry.day_number);
          if (!grouped.has(day)) grouped.set(day, []);
          grouped.get(day)!.push({
            ...entry,
            highlight: String(entry.highlight) === 'true',
            cost_amount: Number(entry.cost_amount) || 0,
            rating: Number(entry.rating) || 0,
          });
        }

        const result: ItineraryDay[] = Array.from(grouped.entries())
          .sort(([a], [b]) => a - b)
          .map(([day_number, dayEntries]) => {
            const sorted = dayEntries.sort((a, b) =>
              (a.time || '').localeCompare(b.time || '')
            );
            return {
              day_number,
              date: sorted[0]?.date ?? '',
              entries: sorted,
              total_cost: sorted.reduce((sum, e) => sum + (e.cost_amount || 0), 0),
              highlights: sorted.filter((e) => e.highlight),
            };
          });

        setDays(result);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [vacationId]);

  return { days, loading, error };
}
