'use client';

import { useState } from 'react';
import { formatCurrency, formatCurrencyAbbrev } from '@/lib/currency-utils';
import type { FixedCostEntry } from '@/types/budget';
import type { Category } from '@/types/category';

interface FixedCostsSectionProps {
  fixedCosts: FixedCostEntry[];
  categories: Category[];
  isIndividual: boolean;
  peopleCount: number;
  currencyCode: string;
  currencySymbol: string;
  conversionRate?: number;
}

export function FixedCostsSection({
  fixedCosts, categories, isIndividual, peopleCount, currencyCode, currencySymbol, conversionRate = 1,
}: FixedCostsSectionProps) {
  const [open, setOpen] = useState(true);
  const total = fixedCosts.reduce((s, f) => s + (Number(f.amount_total) || 0), 0);
  const display = Math.round((isIndividual ? total / peopleCount : total) * conversionRate);

  return (
    <section>
      <button
        className="w-full flex items-center justify-between py-3 mb-1"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--a-muted)' }}>
            Fixed Costs
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--a-raised)', color: 'var(--a-muted)', border: '1px solid var(--a-border)' }}>
            pre-trip
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-display font-semibold text-sm" style={{ color: 'var(--a-text)' }}>
            {formatCurrencyAbbrev(display, currencySymbol)}
          </span>
          <span className="text-xs" style={{ color: 'var(--a-dim)' }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
        >
          {fixedCosts.map((item, i) => {
            const cat = categories.find((c) => c.category_id === item.category_id);
            const amt = Math.round((isIndividual ? Number(item.amount_total) / peopleCount : Number(item.amount_total)) * conversionRate);
            return (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-3.5 border-b last:border-0"
                style={{ borderColor: 'var(--a-border)' }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex-shrink-0">{cat?.emoji ?? '✈️'}</span>
                  <div className="min-w-0">
                    <p className="text-sm truncate" style={{ color: 'var(--a-text)' }}>{item.item_name}</p>
                    {item.notes && (
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--a-dim)' }}>{item.notes}</p>
                    )}
                  </div>
                </div>
                <span className="flex-shrink-0 text-sm font-medium ml-4" style={{ color: 'var(--a-muted)' }}>
                  {formatCurrencyAbbrev(amt, currencySymbol)}
                </span>
              </div>
            );
          })}

          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ backgroundColor: 'var(--a-raised)' }}
          >
            <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--a-dim)' }}>
              {isIndividual ? 'Your share' : 'Total'}
            </span>
            <span className="font-display font-semibold" style={{ color: 'var(--a-text)' }}>
              {formatCurrency(display, currencyCode, currencySymbol)}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
