'use client';

import { VacationCard } from './VacationCard';
import type { Vacation } from '@/types/vacation';

interface VacationGridProps {
  vacations: Vacation[];
}

export function VacationGrid({ vacations }: VacationGridProps) {
  const sorted = [...vacations].sort((a, b) => {
    if (a.status === b.status) return 0;
    return a.status === 'published' ? -1 : 1;
  });

  return (
    <div className="flex flex-col gap-4">
      {sorted.map((v) => (
        <VacationCard key={v.id} vacation={v} />
      ))}
    </div>
  );
}
