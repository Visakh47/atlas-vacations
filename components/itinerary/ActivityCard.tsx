import { formatTime } from '@/lib/date-utils';
import { formatCurrencyAbbrev } from '@/lib/currency-utils';
import { RatingStars } from '@/components/shared/RatingStars';
import type { ItineraryEntry } from '@/types/itinerary';
import type { Category } from '@/types/category';

interface ActivityCardProps {
  entry: ItineraryEntry;
  category?: Category;
  currencySymbol: string;
  conversionRate?: number;
}

export function ActivityCard({ entry, category, currencySymbol, conversionRate = 1 }: ActivityCardProps) {
  const emoji = category?.emoji ?? '📍';

  return (
    <div className="flex gap-4 py-5 border-b last:border-0" style={{ borderColor: 'var(--a-border)' }}>

      {/* Time */}
      <div className="w-16 flex-shrink-0 text-right pt-0.5">
        <span className="text-xs" style={{ color: 'var(--a-dim)' }}>
          {entry.time ? formatTime(entry.time) : ''}
        </span>
      </div>

      {/* Dot connector */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-1.5">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: category?.hex_color ?? 'var(--a-border2)' }}
        />
        <div className="w-px flex-1 min-h-[16px]" style={{ backgroundColor: 'var(--a-border)' }} />
      </div>

      {/* Content */}
      <div className="flex-1 pb-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h4 className="font-semibold text-sm leading-snug" style={{ color: 'var(--a-text)' }}>
            {emoji} {entry.place_name}
          </h4>
          {entry.cost_amount > 0 && (
            <span className="flex-shrink-0 text-xs font-medium" style={{ color: 'var(--a-muted)' }}>
              {formatCurrencyAbbrev(Math.round(entry.cost_amount * conversionRate), currencySymbol)}
            </span>
          )}
        </div>

        {entry.description && (
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--a-muted)' }}>
            {entry.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {entry.rating > 0 && <RatingStars rating={entry.rating} />}
          {entry.sub_category && (
            <span className="text-xs" style={{ color: 'var(--a-dim)' }}>{entry.sub_category}</span>
          )}
          {entry.notes && (
            <span className="text-xs italic" style={{ color: 'var(--a-dim)' }}>{entry.notes}</span>
          )}
        </div>
      </div>
    </div>
  );
}
