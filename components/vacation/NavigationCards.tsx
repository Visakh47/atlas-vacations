import Link from 'next/link';
import type { Vacation } from '@/types/vacation';

const NAV_ITEMS = [
  {
    key: 'itinerary',
    label: 'Itinerary',
    description: 'Day-by-day breakdown of every place, activity, and moment.',
    emoji: '🗓',
    detail: 'Places · Activities · Times',
    href: (id: string) => `/${id}/itinerary`,
  },
  {
    key: 'budget',
    label: 'Budget',
    description: 'Full spending breakdown — categories, days, and per-person splits.',
    emoji: '💰',
    detail: 'Categories · Days · Splits',
    href: (id: string) => `/${id}/budget`,
  },
];

export function NavigationCards({ vacation }: { vacation: Vacation }) {
  return (
    <section className="px-8 lg:px-16 xl:px-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {NAV_ITEMS.map((item) => (
          <Link key={item.key} href={item.href(vacation.id)} className="group block">
            <div
              className="rounded-2xl border h-full transition-all duration-200 overflow-hidden hover:border-[var(--a-accent)]"
              style={{ backgroundColor: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
            >
              {/* Card body */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--a-dim)' }}>
                    {item.detail}
                  </span>
                </div>

                <h3 className="font-display text-3xl font-semibold mb-3" style={{ color: 'var(--a-text)' }}>
                  {item.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--a-muted)' }}>
                  {item.description}
                </p>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between px-8 py-4 border-t transition-colors group-hover:border-[var(--a-border2)]"
                style={{ borderColor: 'var(--a-border)', backgroundColor: 'var(--a-raised)' }}
              >
                <span className="text-xs" style={{ color: 'var(--a-dim)' }}>
                  {vacation.days_count} days · {vacation.people_count} travellers
                </span>
                <span
                  className="text-sm font-medium flex items-center gap-1.5 group-hover:gap-3 transition-all duration-200"
                  style={{ color: 'var(--a-accent)' }}
                >
                  Open {item.label} →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
