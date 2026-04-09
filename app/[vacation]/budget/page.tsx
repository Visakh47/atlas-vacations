'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useVacation } from '@/hooks/useVacations';
import { useCategories } from '@/hooks/useCategories';
import { useBudget } from '@/hooks/useBudget';
import { useFixedCosts } from '@/hooks/useFixedCosts';
import { BudgetToggle } from '@/components/budget/BudgetToggle';
import { CurrencyToggle } from '@/components/budget/CurrencyToggle';
import { ViewModeSelector, type ViewMode } from '@/components/budget/ViewModeSelector';
import { FixedCostsSection } from '@/components/budget/FixedCostsSection';
import { CategoryBreakdownCard } from '@/components/budget/CategoryBreakdownCard';
import { BudgetDayView } from '@/components/budget/BudgetDayView';
import { SpendDonutChart } from '@/components/budget/SpendDonutChart';
import { SpendByDayBarChart } from '@/components/budget/SpendByDayBarChart';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { CURRENCY_CONVERSIONS, formatCurrencyAbbrev } from '@/lib/currency-utils';

export default function BudgetPage({ params }: { params: Promise<{ vacation: string }> }) {
  const { vacation: vacationId } = use(params);
  const { vacation } = useVacation(vacationId);
  const { categories, subCategories, loading: catLoading } = useCategories();
  const { fixedCosts } = useFixedCosts(vacationId);
  const { metrics, loading: budgetLoading } = useBudget(
    vacationId,
    vacation?.people_count ?? 1,
    vacation?.days_count ?? 1,
    categories,
    subCategories
  );

  const [isIndividual, setIsIndividual] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('category');
  const [showNative, setShowNative] = useState(false); // false = INR (default)

  if (catLoading || budgetLoading || !vacation || !metrics) return <PageLoader />;

  const { currency_code: currencyCode, currency_symbol: currencySymbol, people_count: peopleCount } = vacation;
  const conversion = CURRENCY_CONVERSIONS[currencyCode];
  const conversionRate = !showNative && conversion ? conversion.rate : 1;
  const displaySymbol = !showNative && conversion ? conversion.symbol : currencySymbol;
  const displayCode = !showNative && conversion ? conversion.code : currencyCode;

  const sharedProps = { isIndividual, peopleCount, currencySymbol: displaySymbol, conversionRate };

  return (
    <div style={{ backgroundColor: 'var(--a-bg)' }} className="min-h-screen flex flex-col">

      {/* Header */}
      <div className="px-6 pt-8 pb-4 border-b flex-shrink-0" style={{ borderColor: 'var(--a-border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs" style={{ color: 'var(--a-muted)' }}>
              <Link href={`/${vacationId}`} className="hover:underline">{vacation.name}</Link>
              <span style={{ color: 'var(--a-dim)' }}>→</span>
              <span style={{ color: 'var(--a-dim)' }}>Budget</span>
            </div>
            <h1 className="font-display text-2xl font-semibold" style={{ color: 'var(--a-text)' }}>
              Budget
            </h1>
          </div>
          <Link
            href={`/${vacationId}/itinerary`}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:border-[var(--a-border2)]"
            style={{ color: 'var(--a-muted)', borderColor: 'var(--a-border)' }}
          >
            Itinerary →
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row flex-1">

        {/* ── Left panel ─────────────────────────────────────────── */}
        <aside
          className="w-full lg:w-80 xl:w-96 flex-shrink-0 lg:border-r lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
          style={{ borderColor: 'var(--a-border)', backgroundColor: 'var(--a-surface)' }}
        >
          <div className="p-6 space-y-6">

            {/* Controls */}
            <div className="flex flex-col gap-2.5">
              <BudgetToggle isIndividual={isIndividual} onToggle={() => setIsIndividual(!isIndividual)} peopleCount={peopleCount} />
              {conversion && (
                <CurrencyToggle
                  nativeCode={currencyCode}
                  nativeSymbol={currencySymbol}
                  showNative={showNative}
                  onToggle={() => setShowNative(!showNative)}
                />
              )}
            </div>

            {/* Key metrics — vertical in sidebar */}
            <div className="space-y-2.5">
              {/* Primary: share / total */}
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: 'var(--a-raised)', border: '1px solid var(--a-border2)' }}
              >
                <p className="text-xs mb-2" style={{ color: 'var(--a-muted)' }}>
                  {isIndividual ? 'Your share' : 'Trip total'}
                </p>
                <p className="font-display text-2xl font-semibold" style={{ color: 'var(--a-accent)' }}>
                  {formatCurrencyAbbrev(Math.round((isIndividual ? metrics.individual_share : metrics.grand_total) * conversionRate), displaySymbol)}
                </p>
              </div>

              {/* Secondary 2-col grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Fixed costs', v: metrics.fixed_costs_total / (isIndividual ? peopleCount : 1) },
                  { label: 'Daily spend', v: metrics.daily_spend_total / (isIndividual ? peopleCount : 1) },
                  { label: 'Avg / day', v: metrics.avg_per_day / (isIndividual ? peopleCount : 1) },
                  { label: `Day ${metrics.most_expensive_day.day_number} (high)`, v: metrics.most_expensive_day.total / (isIndividual ? peopleCount : 1) },
                ].map(({ label, v }) => (
                  <div key={label} className="rounded-xl p-3.5"
                    style={{ backgroundColor: 'var(--a-bg)', border: '1px solid var(--a-border)' }}>
                    <p className="text-xs mb-1.5" style={{ color: 'var(--a-muted)' }}>{label}</p>
                    <p className="font-display text-base font-semibold" style={{ color: 'var(--a-text)' }}>
                      {formatCurrencyAbbrev(Math.round(v * conversionRate), displaySymbol)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Top 3 categories */}
              {metrics.categories_summary.length > 0 && (
                <div className="rounded-xl overflow-hidden"
                  style={{ backgroundColor: 'var(--a-bg)', border: '1px solid var(--a-border)' }}>
                  <p className="text-xs px-3.5 pt-3.5 pb-2" style={{ color: 'var(--a-muted)' }}>Top categories</p>
                  {metrics.categories_summary.slice(0, 3).map((cat, i) => (
                    <div key={cat.category_id}
                      className="flex items-center gap-2.5 px-3.5 py-2.5"
                      style={{ borderTop: i > 0 ? '1px solid var(--a-border)' : 'none' }}>
                      <span className="text-base flex-shrink-0">{cat.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--a-text)' }}>
                          {cat.category_name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--a-border)' }}>
                            <div className="h-full rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: cat.hex_color }} />
                          </div>
                          <span className="text-xs flex-shrink-0" style={{ color: 'var(--a-dim)' }}>{cat.percentage}%</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold flex-shrink-0 tabular-nums" style={{ color: 'var(--a-text)' }}>
                        {formatCurrencyAbbrev(Math.round((isIndividual ? cat.total / peopleCount : cat.total) * conversionRate), displaySymbol)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fixed costs */}
            <div>
              <FixedCostsSection
                fixedCosts={fixedCosts}
                categories={categories}
                currencyCode={displayCode}
                {...sharedProps}
              />
            </div>

          </div>
        </aside>

        {/* ── Right panel ────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 px-6 lg:px-8 py-6 space-y-6">

          {/* View mode selector + label */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--a-muted)' }}>
              Spend Breakdown
            </span>
            <ViewModeSelector mode={viewMode} onChange={setViewMode} />
          </div>

          {/* ── By Category ── */}
          {viewMode === 'category' && (
            <div className="space-y-5">
              <div className="rounded-2xl border p-6"
                style={{ backgroundColor: 'var(--a-surface)', borderColor: 'var(--a-border)' }}>
                <p className="text-xs uppercase tracking-widest mb-5" style={{ color: 'var(--a-muted)' }}>
                  Total spend by category
                </p>
                <SpendDonutChart
                  categories={metrics.categories_summary}
                  {...sharedProps}
                />
              </div>
              <div className="space-y-2">
                {metrics.categories_summary.map((cat) => (
                  <CategoryBreakdownCard
                    key={cat.category_id}
                    category={cat}
                    totalSpend={metrics.grand_total}
                    {...sharedProps}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── By Day ── */}
          {viewMode === 'day' && (
            <div className="space-y-5">
              <div className="rounded-2xl border p-6"
                style={{ backgroundColor: 'var(--a-surface)', borderColor: 'var(--a-border)' }}>
                <p className="text-xs uppercase tracking-widest mb-5" style={{ color: 'var(--a-muted)' }}>
                  Spend by day
                </p>
                <SpendByDayBarChart
                  days={metrics.days_summary}
                  {...sharedProps}
                />
              </div>
              <div className="space-y-2">
                {metrics.days_summary.map((day) => (
                  <BudgetDayView key={day.day_number} day={day} categories={categories} {...sharedProps} />
                ))}
              </div>
            </div>
          )}

          {/* ── All Items ── */}
          {viewMode === 'all' && (
            <div className="space-y-2">
              {metrics.days_summary.map((day) => (
                <BudgetDayView key={day.day_number} day={day} categories={categories} defaultExpanded {...sharedProps} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
