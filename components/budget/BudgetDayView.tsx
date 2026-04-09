'use client';

import { useState } from 'react';
import { formatDateShort } from '@/lib/date-utils';
import { formatCurrencyAbbrev } from '@/lib/currency-utils';
import type { BudgetDaySummary } from '@/types/budget';
import type { Category } from '@/types/category';

interface BudgetDayViewProps {
  day: BudgetDaySummary;
  categories: Category[];
  isIndividual: boolean;
  peopleCount: number;
  currencySymbol: string;
  conversionRate?: number;
  defaultExpanded?: boolean;
}

export function BudgetDayView({
  day, categories, isIndividual, peopleCount, currencySymbol, conversionRate = 1, defaultExpanded = false,
}: BudgetDayViewProps) {
  const [open, setOpen] = useState(defaultExpanded);
  const display = Math.round((isIndividual ? day.total / peopleCount : day.total) * conversionRate);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ backgroundColor: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--a-raised)] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm" style={{ color: 'var(--a-text)' }}>
            Day {day.day_number}
          </span>
          <span className="text-xs" style={{ color: 'var(--a-dim)' }}>
            {formatDateShort(day.date)}
          </span>
          <span className="text-xs" style={{ color: 'var(--a-dim)' }}>
            · {day.items.length} items
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm" style={{ color: 'var(--a-text)' }}>
            {formatCurrencyAbbrev(display, currencySymbol)}
          </span>
          <span className="text-xs" style={{ color: 'var(--a-dim)' }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="border-t" style={{ borderColor: 'var(--a-border)' }}>
          {day.items.map((item, i) => {
            const cat = categories.find((c) => c.category_id === item.category_id);
            const amt = Math.round((isIndividual ? Number(item.amount_total) / peopleCount : Number(item.amount_total)) * conversionRate);
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 border-b last:border-0"
                style={{ borderColor: 'var(--a-border)' }}
              >
                <span className="text-sm flex-shrink-0">{cat?.emoji ?? '·'}</span>
                <span className="flex-1 text-sm" style={{ color: 'var(--a-muted)' }}>{item.item_name}</span>
                <span className="text-sm font-medium flex-shrink-0" style={{ color: cat?.hex_color ?? 'var(--a-muted)' }}>
                  {formatCurrencyAbbrev(amt, currencySymbol)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
