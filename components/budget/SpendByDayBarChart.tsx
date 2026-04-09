'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, LabelList, CartesianGrid,
} from 'recharts';
import type { BudgetDaySummary } from '@/types/budget';
import { formatCurrencyAbbrev } from '@/lib/currency-utils';

interface SpendByDayBarChartProps {
  days: BudgetDaySummary[];
  isIndividual: boolean;
  peopleCount: number;
  currencySymbol: string;
  conversionRate?: number;
}

export function SpendByDayBarChart({
  days, isIndividual, peopleCount, currencySymbol, conversionRate = 1,
}: SpendByDayBarChartProps) {
  const data = days.map((d) => {
    const raw = isIndividual ? d.total / peopleCount : d.total;
    const value = Math.round(raw * conversionRate);
    return {
      name: `${d.day_number}`,
      value,
      label: formatCurrencyAbbrev(value, currencySymbol),
    };
  });

  const maxVal = Math.max(...data.map((d) => d.value));

  return (
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 4, bottom: 0, left: 4 }} barCategoryGap="30%">
          <defs>
            <linearGradient id="barAccent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: 'var(--a-accent)' }} stopOpacity={1} />
              <stop offset="100%" style={{ stopColor: 'var(--a-accent-dark)' }} stopOpacity={0.9} />
            </linearGradient>
            <linearGradient id="barMuted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: 'var(--a-dim)' }} stopOpacity={1} />
              <stop offset="100%" style={{ stopColor: 'var(--a-chart-muted)' }} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--a-border)" strokeDasharray="0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: 'var(--a-muted)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `D${v}`}
          />
          <YAxis hide />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [formatCurrencyAbbrev(Number(value), currencySymbol), 'Spent']}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            labelFormatter={(label: any) => `Day ${label}`}
            contentStyle={{
              backgroundColor: 'var(--a-surface)',
              border: '1px solid var(--a-border)',
              borderRadius: '12px',
              fontSize: '12px',
              color: 'var(--a-text)',
              padding: '8px 12px',
            }}
            cursor={{ fill: 'var(--a-raised)' }}
          />
          <Bar dataKey="value" radius={[5, 5, 2, 2]}>
            <LabelList
              dataKey="label"
              position="top"
              style={{ fontSize: 9, fill: 'var(--a-muted)' }}
            />
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.value === maxVal ? 'url(#barAccent)' : 'url(#barMuted)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
