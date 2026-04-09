'use client';

import { useState } from 'react';
import { formatCurrencyAbbrev } from '@/lib/currency-utils';
import type { BudgetCategorySummary } from '@/types/budget';

interface CategoryBreakdownCardProps {
  category: BudgetCategorySummary;
  isIndividual: boolean;
  peopleCount: number;
  currencySymbol: string;
  totalSpend: number;
  conversionRate?: number;
}

export function CategoryBreakdownCard({
  category, isIndividual, peopleCount, currencySymbol, totalSpend, conversionRate = 1,
}: CategoryBreakdownCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [expandedSubCat, setExpandedSubCat] = useState<string | null>(null);

  const divisor = isIndividual ? peopleCount : 1;
  const display = Math.round((category.total / divisor) * conversionRate);
  const pct = totalSpend > 0 ? Math.round((category.total / totalSpend) * 100) : 0;
  const hasSubCats = category.sub_categories.length > 0;

  function toggleCategory() {
    if (!hasSubCats) return;
    setExpanded((v) => {
      if (v) setExpandedSubCat(null); // collapse all sub-cats when closing
      return !v;
    });
  }

  function toggleSubCat(subId: string) {
    setExpandedSubCat((cur) => (cur === subId ? null : subId));
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ backgroundColor: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
    >
      {/* ── Category header ─────────────────────────────────────────── */}
      <button
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--a-raised)] transition-colors"
        onClick={toggleCategory}
      >
        <span className="flex-shrink-0 text-lg">{category.emoji}</span>
        <span className="flex-1 text-sm font-medium" style={{ color: 'var(--a-text)' }}>
          {category.category_name}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: `${category.hex_color}18`, color: category.hex_color }}>
          {pct}%
        </span>
        <span className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--a-text)' }}>
          {formatCurrencyAbbrev(display, currencySymbol)}
        </span>
        {hasSubCats && (
          <span className="text-xs flex-shrink-0" style={{ color: 'var(--a-dim)' }}>
            {expanded ? '▲' : '▼'}
          </span>
        )}
      </button>

      {/* Progress bar */}
      <div className="px-5 pb-3">
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--a-border)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: category.hex_color }}
          />
        </div>
      </div>

      {/* ── Sub-categories ───────────────────────────────────────────── */}
      {expanded && hasSubCats && (
        <div className="border-t" style={{ borderColor: 'var(--a-border)' }}>
          {category.sub_categories.map((sub) => {
            const subDisplay = Math.round((sub.total / divisor) * conversionRate);
            const isSubOpen = expandedSubCat === sub.sub_category_id;
            const hasItems = sub.items.length > 0;

            return (
              <div key={sub.sub_category_id}>
                {/* Sub-cat row */}
                <button
                  className="w-full flex items-center gap-2.5 px-5 py-2.5 text-left transition-colors"
                  style={{ cursor: hasItems ? 'pointer' : 'default' }}
                  onClick={() => hasItems && toggleSubCat(sub.sub_category_id)}
                >
                  <span className="flex-shrink-0 text-sm">{sub.emoji}</span>
                  <span className="text-xs w-32 truncate flex-shrink-0" style={{ color: 'var(--a-muted)' }}>
                    {sub.sub_category_name}
                  </span>
                  <div className="flex-1 h-px rounded-full overflow-hidden mx-1"
                    style={{ backgroundColor: 'var(--a-border)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${sub.percentage}%`, backgroundColor: `${category.hex_color}70` }}
                    />
                  </div>
                  <span className="flex-shrink-0 text-xs font-medium" style={{ color: 'var(--a-muted)' }}>
                    {formatCurrencyAbbrev(subDisplay, currencySymbol)}
                  </span>
                  {hasItems && (
                    <span className="flex-shrink-0 text-xs w-3 text-center" style={{ color: 'var(--a-dim)' }}>
                      {isSubOpen ? '▲' : '▼'}
                    </span>
                  )}
                </button>

                {/* ── Line items ──────────────────────────────────────── */}
                {isSubOpen && hasItems && (
                  <div
                    className="border-t border-b"
                    style={{ backgroundColor: 'var(--a-bg)', borderColor: 'var(--a-border)' }}
                  >
                    {sub.items.map((item, idx) => {
                      const itemAmt = Math.round((item.amount_total / divisor) * conversionRate);
                      const dayLabel = item.is_fixed ? 'Pre-trip' : `Day ${item.day_number}`;
                      const isLast = idx === sub.items.length - 1;

                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 px-5 py-2"
                          style={{
                            borderBottom: isLast ? 'none' : `1px solid var(--a-border)`,
                          }}
                        >
                          {/* Day badge */}
                          <span
                            className="flex-shrink-0 text-center rounded px-1.5 py-0.5"
                            style={{
                              fontSize: '10px',
                              minWidth: '46px',
                              backgroundColor: item.is_fixed
                                ? `${category.hex_color}18`
                                : 'var(--a-raised)',
                              color: item.is_fixed ? category.hex_color : 'var(--a-dim)',
                            }}
                          >
                            {dayLabel}
                          </span>
                          {/* Item name */}
                          <span className="flex-1 text-xs truncate" style={{ color: 'var(--a-muted)' }}>
                            {item.item_name}
                          </span>
                          {/* Amount */}
                          <span className="flex-shrink-0 text-xs font-medium tabular-nums"
                            style={{ color: 'var(--a-text)' }}>
                            {formatCurrencyAbbrev(itemAmt, currencySymbol)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
