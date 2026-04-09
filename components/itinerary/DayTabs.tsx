'use client';

import { formatCurrencyAbbrev } from '@/lib/currency-utils';
import type { ItineraryDay } from '@/types/itinerary';

interface DayTabsProps {
  days: ItineraryDay[];
  activeDay: number;
  onSelect: (day: number) => void;
  currencySymbol: string;
  conversionRate?: number;
}

export function DayTabs({ days, activeDay, onSelect, currencySymbol, conversionRate = 1 }: DayTabsProps) {
  return (
    <div
      className="sticky top-0 z-10 border-b"
      style={{ backgroundColor: 'var(--a-bg)', borderColor: 'var(--a-border)' }}
    >
      <div className="px-4">
        <div className="flex items-end gap-1 overflow-x-auto scrollbar-hide py-3">
          {days.map((day) => {
            const active = day.day_number === activeDay;
            return (
              <button
                key={day.day_number}
                onClick={() => onSelect(day.day_number)}
                className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-lg text-xs transition-all duration-150"
                style={
                  active
                    ? { backgroundColor: 'var(--a-raised)', borderBottom: '2px solid var(--a-accent)', color: 'var(--a-text)' }
                    : { color: 'var(--a-dim)' }
                }
              >
                <span className={active ? 'font-semibold' : 'font-normal'}>{day.day_number}</span>
                {day.total_cost > 0 && (
                  <span className="text-[10px] mt-0.5 opacity-60">
                    {formatCurrencyAbbrev(Math.round(day.total_cost * conversionRate), currencySymbol)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
