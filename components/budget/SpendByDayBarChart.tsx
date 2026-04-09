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
              <stop offset="0%" stopColor="#4ADE80" stopOpacity={1} />
              <stop offset="100%" stopColor="#22C55E" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="barMuted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E4028" stopOpacity={1} />
              <stop offset="100%" stopColor="#16301C" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#16301C" strokeDasharray="0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#557A60' }}
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
              backgroundColor: '#0A1A0D',
              border: '1px solid #214530',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#D5EDD9',
              padding: '8px 12px',
            }}
            cursor={{ fill: 'rgba(74,222,128,0.05)' }}
          />
          <Bar dataKey="value" radius={[5, 5, 2, 2]}>
            <LabelList
              dataKey="label"
              position="top"
              style={{ fontSize: 9, fill: '#557A60' }}
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
