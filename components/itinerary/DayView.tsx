import { formatDate } from '@/lib/date-utils';
import { formatCurrency } from '@/lib/currency-utils';
import { ActivityCard } from './ActivityCard';
import { HighlightCard } from './HighlightCard';
import type { ItineraryDay } from '@/types/itinerary';
import type { Category } from '@/types/category';

interface DayViewProps {
  day: ItineraryDay;
  categories: Category[];
  currencyCode: string;
  currencySymbol: string;
  conversionRate?: number;
}

export function DayView({ day, categories, currencyCode, currencySymbol, conversionRate = 1 }: DayViewProps) {
  return (
    <div className="px-8 pt-8 pb-20">

      {/* Day header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--a-muted)' }}>
            Day {day.day_number}
          </p>
          <h2 className="font-display text-3xl font-semibold" style={{ color: 'var(--a-text)' }}>
            {formatDate(day.date)}
          </h2>
          {day.highlights.length > 0 && (
            <p className="text-xs mt-2" style={{ color: 'var(--a-accent)' }}>
              ✦ {day.highlights.length} highlight{day.highlights.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {day.total_cost > 0 && (
          <div className="text-right">
            <p className="text-xs mb-0.5" style={{ color: 'var(--a-dim)' }}>Day total</p>
            <p className="font-display text-xl font-semibold" style={{ color: 'var(--a-text)' }}>
              {formatCurrency(Math.round(day.total_cost * conversionRate), currencyCode, currencySymbol)}
            </p>
          </div>
        )}
      </div>

      {/* Activity feed */}
      <div>
        {day.entries.map((entry, i) => {
          const cat = categories.find((c) => c.category_id === entry.category);
          return entry.highlight ? (
            <HighlightCard key={i} entry={entry} category={cat} currencySymbol={currencySymbol} conversionRate={conversionRate} />
          ) : (
            <ActivityCard key={i} entry={entry} category={cat} currencySymbol={currencySymbol} conversionRate={conversionRate} />
          );
        })}
      </div>
    </div>
  );
}
