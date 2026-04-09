'use client';

import Link from 'next/link';
import { formatDateRange } from '@/lib/date-utils';
import type { Vacation } from '@/types/vacation';

interface VacationCardProps {
  vacation: Vacation;
}

function CardMeta({ vacation }: { vacation: Vacation }) {
  return (
    <span>{vacation.days_count} day{vacation.days_count !== 1 ? 's' : ''}</span>
  );
}

export function VacationCard({ vacation }: VacationCardProps) {
  const { status } = vacation;
  const year = vacation.start_date ? new Date(vacation.start_date + 'T00:00:00').getFullYear() : null;

  // ── Draft (coming soon) ─────────────────────────────────────────
  if (status === 'draft') {
    return (
      <div
        className="rounded-2xl px-8 py-7 border opacity-35"
        style={{ backgroundColor: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
      >
        <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--a-dim)' }}>
          {vacation.flag_emoji}&ensp;{vacation.country}
        </p>
        <h3 className="font-display text-4xl font-semibold" style={{ color: 'var(--a-text)' }}>
          {vacation.name}
        </h3>
        <p className="text-sm mt-5 inline-block border rounded-full px-3 py-1"
          style={{ color: 'var(--a-dim)', borderColor: 'var(--a-border)' }}>
          Coming soon
        </p>
      </div>
    );
  }

  // ── View Only ───────────────────────────────────────────────────
  if (status === 'view_only') {
    return (
      <article
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
      >
        <div className="px-8 pt-8 pb-7 flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-[0.25em] mb-5 flex items-center gap-2" style={{ color: 'var(--a-muted)' }}>
              <span>{vacation.flag_emoji}</span>
              <span>{vacation.country}</span>
            </p>
            <h3
              className="font-display font-semibold leading-[1] tracking-tight mb-4"
              style={{ color: 'var(--a-text)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
            >
              {vacation.name}
            </h3>
            <p
              className="font-display italic leading-relaxed"
              style={{ color: 'var(--a-muted)', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', maxWidth: '32rem' }}
            >
              &ldquo;{vacation.tagline}&rdquo;
            </p>
          </div>
          {year && (
            <div
              className="font-display font-semibold leading-none flex-shrink-0 hidden lg:block select-none"
              style={{ color: 'var(--a-dim)', fontSize: 'clamp(3.5rem, 6vw, 6rem)', opacity: 0.18, letterSpacing: '-0.02em' }}
            >
              {year}
            </div>
          )}
        </div>
        <div
          className="flex items-center px-8 py-4 border-t"
          style={{ borderColor: 'var(--a-border)', backgroundColor: 'var(--a-raised)' }}
        >
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--a-dim)' }}>
            <span>{formatDateRange(vacation.start_date, vacation.end_date)}</span>
            <span style={{ color: 'var(--a-border2)' }}>·</span>
            <CardMeta vacation={vacation} />
            <span style={{ color: 'var(--a-border2)' }}>·</span>
            <span>{vacation.people_count} {vacation.people_count === 1 ? 'traveller' : 'travellers'}</span>
          </div>
        </div>
      </article>
    );
  }

  // ── Published ───────────────────────────────────────────────────
  return (
    <Link href={`/${vacation.id}`} className="group block">
      <article
        className="rounded-2xl border transition-all duration-300 hover:border-[var(--a-border2)] overflow-hidden"
        style={{ backgroundColor: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
      >
        <div className="px-8 pt-8 pb-7 flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-[0.25em] mb-5 flex items-center gap-2" style={{ color: 'var(--a-muted)' }}>
              <span>{vacation.flag_emoji}</span>
              <span>{vacation.country}</span>
            </p>
            <h3
              className="font-display font-semibold leading-[1] tracking-tight mb-4"
              style={{ color: 'var(--a-text)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
            >
              {vacation.name}
            </h3>
            <p
              className="font-display italic leading-relaxed"
              style={{ color: 'var(--a-muted)', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', maxWidth: '32rem' }}
            >
              &ldquo;{vacation.tagline}&rdquo;
            </p>
          </div>
          {year && (
            <div
              className="font-display font-semibold leading-none flex-shrink-0 hidden lg:block select-none"
              style={{ color: 'var(--a-dim)', fontSize: 'clamp(3.5rem, 6vw, 6rem)', opacity: 0.18, letterSpacing: '-0.02em' }}
            >
              {year}
            </div>
          )}
        </div>
        <div
          className="flex items-center justify-between px-8 py-4 border-t"
          style={{ borderColor: 'var(--a-border)', backgroundColor: 'var(--a-raised)' }}
        >
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--a-dim)' }}>
            <span>{formatDateRange(vacation.start_date, vacation.end_date)}</span>
            <span style={{ color: 'var(--a-border2)' }}>·</span>
            <CardMeta vacation={vacation} />
            <span style={{ color: 'var(--a-border2)' }}>·</span>
            <span>{vacation.people_count} {vacation.people_count === 1 ? 'traveller' : 'travellers'}</span>
          </div>
          <div
            className="flex items-center gap-1.5 text-sm font-medium group-hover:gap-3 transition-all duration-200"
            style={{ color: 'var(--a-accent)' }}
          >
            <span>Explore</span>
            <span>→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
