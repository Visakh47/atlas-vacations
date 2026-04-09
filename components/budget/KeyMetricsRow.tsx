import { formatCurrencyAbbrev } from '@/lib/currency-utils';
import type { BudgetMetrics } from '@/types/budget';

interface KeyMetricsRowProps {
  metrics: BudgetMetrics;
  isIndividual: boolean;
  currencySymbol: string;
  conversionRate?: number;
}

export function KeyMetricsRow({ metrics, isIndividual, currencySymbol, conversionRate = 1 }: KeyMetricsRowProps) {
  const d = isIndividual
    ? metrics.grand_total > 0 ? metrics.grand_total / metrics.individual_share : 1
    : 1;

  const fmt = (v: number) => formatCurrencyAbbrev(Math.round(v * conversionRate), currencySymbol);

  const items = [
    {
      label: isIndividual ? 'Your share' : 'Trip total',
      value: fmt(isIndividual ? metrics.individual_share : metrics.grand_total),
      accent: true,
    },
    {
      label: 'Fixed costs',
      value: fmt(isIndividual ? metrics.fixed_costs_total / d : metrics.fixed_costs_total),
    },
    {
      label: 'Daily spend',
      value: fmt(isIndividual ? metrics.daily_spend_total / d : metrics.daily_spend_total),
    },
    {
      label: 'Avg per day',
      value: fmt(isIndividual ? metrics.avg_per_day / d : metrics.avg_per_day),
    },
    {
      label: `Day ${metrics.most_expensive_day.day_number} (highest)`,
      value: fmt(isIndividual ? metrics.most_expensive_day.total / d : metrics.most_expensive_day.total),
    },
    {
      label: 'Top category',
      value: metrics.top_category
        ? `${metrics.top_category.emoji} ${metrics.top_category.category_name}`
        : '—',
      subValue: metrics.top_category
        ? `${metrics.top_category.percentage}% of daily`
        : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl p-4"
          style={{
            backgroundColor: item.accent ? 'var(--a-raised)' : 'var(--a-surface)',
            border: item.accent ? '1px solid var(--a-border2)' : '1px solid var(--a-border)',
          }}
        >
          <p className="text-xs mb-2" style={{ color: 'var(--a-muted)' }}>{item.label}</p>
          <p
            className={`font-display font-semibold ${item.accent ? 'text-2xl' : 'text-lg'}`}
            style={{ color: item.accent ? 'var(--a-accent)' : 'var(--a-text)' }}
          >
            {item.value}
          </p>
          {item.subValue && (
            <p className="text-xs mt-1" style={{ color: 'var(--a-dim)' }}>{item.subValue}</p>
          )}
        </div>
      ))}
    </div>
  );
}
