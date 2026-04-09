import Link from 'next/link';
import { formatDateRange } from '@/lib/date-utils';
import type { Vacation } from '@/types/vacation';

interface VacationHeroProps {
  vacation: Vacation;
}

export function VacationHero({ vacation }: VacationHeroProps) {
  return (
    <section className="relative overflow-hidden min-h-[50vh] flex items-end">
      {/* Gradient background using theme CSS vars */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, var(--gradient-from) 0%, var(--gradient-to) 100%)',
        }}
      />
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-black/30" />
      {/* Decorative orbs */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: 'var(--color-secondary)' }} />
      <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: 'var(--color-accent)' }} />

      {/* Back nav */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors border border-white/20 hover:border-white/40 rounded-full px-3 py-1.5"
        >
          <span>←</span>
          <span>All Adventures</span>
        </Link>
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-6 pb-12 pt-20">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{vacation.flag_emoji}</span>
          <span className="text-sm font-medium tracking-widest uppercase text-white/60">
            {vacation.country}
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
          {vacation.name}
        </h1>
        <p className="text-white/80 text-lg italic mb-6 max-w-2xl">
          &ldquo;{vacation.tagline}&rdquo;
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm text-white/70 border border-white/20 rounded-full px-3 py-1">
            <span>📅</span>
            <span>{formatDateRange(vacation.start_date, vacation.end_date)}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-white/70 border border-white/20 rounded-full px-3 py-1">
            <span>🌙</span>
            <span>{vacation.days_count} days</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-white/70 border border-white/20 rounded-full px-3 py-1">
            <span>👥</span>
            <span>{vacation.people_count} {vacation.people_count === 1 ? 'traveller' : 'travellers'}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
