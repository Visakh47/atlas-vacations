'use client';

import { formatCurrencyAbbrev } from '@/lib/currency-utils';
import { formatDateShort } from '@/lib/date-utils';
import type { ItineraryDay } from '@/types/itinerary';

interface DaySidebarProps {
  days: ItineraryDay[];
  activeDay: number;
  onSelect: (day: number) => void;
  currencySymbol: string;
  conversionRate?: number;
}

export function DaySidebar({ days, activeDay, onSelect, currencySymbol, conversionRate = 1 }: DaySidebarProps) {
  return (
    <aside
      className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r"
      style={{ borderColor: 'var(--a-border)', backgroundColor: 'var(--a-surface)' }}
    >
      <div className="sticky top-0 h-screen overflow-y-auto scrollbar-hide py-6">
        <p className="text-xs uppercase tracking-widest px-5 mb-3" style={{ color: 'var(--a-dim)' }}>
          Days
        </p>
        <div className="flex flex-col">
          {days.map((day) => {
            const active = day.day_number === activeDay;
            return (
              <button
                key={day.day_number}
                onClick={() => onSelect(day.day_number)}
                className="flex items-center gap-3 px-5 py-3 text-left border-l-2 transition-all duration-150 hover:bg-[var(--a-raised)]"
                style={
                  active
                    ? { borderLeftColor: 'var(--a-accent)', backgroundColor: 'var(--a-raised)' }
                    : { borderLeftColor: 'transparent' }
                }
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: active ? 'var(--a-text)' : 'var(--a-muted)' }}
                    >
                      Day {day.day_number}
                    </span>
                    {day.total_cost > 0 && (
                      <span className="text-xs tabular-nums" style={{ color: 'var(--a-dim)' }}>
                        {formatCurrencyAbbrev(Math.round(day.total_cost * conversionRate), currencySymbol)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--a-dim)' }}>
                    {formatDateShort(day.date)}
                  </p>
                  {day.highlights.length > 0 && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--a-accent)' }}>
                      ✦ {day.highlights.length} highlight{day.highlights.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
