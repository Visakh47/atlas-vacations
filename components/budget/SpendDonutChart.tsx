'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { BudgetCategorySummary } from '@/types/budget';
import { formatCurrencyAbbrev } from '@/lib/currency-utils';

interface SpendDonutChartProps {
  categories: BudgetCategorySummary[];
  isIndividual: boolean;
  peopleCount: number;
  currencySymbol: string;
  conversionRate?: number;
}

export function SpendDonutChart({
  categories, isIndividual, peopleCount, currencySymbol, conversionRate = 1,
}: SpendDonutChartProps) {
  const data = categories
    .filter((c) => c.total > 0)
    .map((c) => {
      const raw = isIndividual ? c.total / peopleCount : c.total;
      return {
        name: `${c.emoji} ${c.category_name}`,
        value: Math.round(raw * conversionRate),
        color: c.hex_color,
        rawValue: raw,
      };
    });

  const total = data.reduce((s, d) => s + d.value, 0);
  const totalLabel = formatCurrencyAbbrev(total, currencySymbol);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CenterLabel = ({ viewBox }: { viewBox?: any }) => {
    if (!viewBox) return null;
    const { cx, cy } = viewBox;
    return (
      <g>
        <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="central"
          fill="var(--a-text)" fontSize="18" fontWeight="600" fontFamily="var(--font-display)">
          {totalLabel}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="central"
          fill="var(--a-muted)" fontSize="11">
          {isIndividual ? 'your share' : 'total spend'}
        </text>
      </g>
    );
  };

  return (
    <div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {data.map((entry, i) => (
                <radialGradient key={i} id={`grad-${i}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.75} />
                </radialGradient>
              ))}
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={`url(#grad-${i})`} stroke="transparent" />
              ))}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <CenterLabel viewBox={undefined as any} />
            </Pie>
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [formatCurrencyAbbrev(Number(value), currencySymbol), '']}
              contentStyle={{
                backgroundColor: 'var(--a-surface)',
                border: '1px solid var(--a-border)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--a-text)',
                padding: '8px 12px',
              }}
              itemStyle={{ color: 'var(--a-text)' }}
              labelStyle={{ color: 'var(--a-muted)', marginBottom: '4px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs" style={{ color: 'var(--a-muted)' }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
