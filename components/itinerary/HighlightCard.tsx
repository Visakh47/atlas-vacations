import { formatTime } from '@/lib/date-utils';
import { formatCurrencyAbbrev } from '@/lib/currency-utils';
import { RatingStars } from '@/components/shared/RatingStars';
import type { ItineraryEntry } from '@/types/itinerary';
import type { Category } from '@/types/category';

interface HighlightCardProps {
  entry: ItineraryEntry;
  category?: Category;
  currencySymbol: string;
  conversionRate?: number;
}

export function HighlightCard({ entry, category, currencySymbol, conversionRate = 1 }: HighlightCardProps) {
  const emoji = category?.emoji ?? '⭐';

  return (
    <div
      className="rounded-2xl p-6 border-l-2 my-2"
      style={{
        backgroundColor: 'var(--a-raised)',
        borderLeftColor: 'var(--a-accent)',
        borderTop: '1px solid var(--a-border)',
        borderRight: '1px solid var(--a-border)',
        borderBottom: '1px solid var(--a-border)',
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--a-accent)' }}
            >
              ✦ Highlight
            </span>
            {entry.time && (
              <span className="text-xs" style={{ color: 'var(--a-dim)' }}>
                · {formatTime(entry.time)}
              </span>
            )}
          </div>
          <h4 className="font-display text-xl font-semibold mt-1" style={{ color: 'var(--a-text)' }}>
            {emoji} {entry.place_name}
          </h4>
        </div>
        {entry.cost_amount > 0 && (
          <span className="flex-shrink-0 text-sm font-medium" style={{ color: 'var(--a-muted)' }}>
            {formatCurrencyAbbrev(Math.round(entry.cost_amount * conversionRate), currencySymbol)}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--a-muted)' }}>
        {entry.description}
      </p>

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-3">
        {entry.rating > 0 && <RatingStars rating={entry.rating} />}
        {entry.notes && (
          <span className="text-xs italic" style={{ color: 'var(--a-dim)' }}>{entry.notes}</span>
        )}
      </div>
    </div>
  );
}
