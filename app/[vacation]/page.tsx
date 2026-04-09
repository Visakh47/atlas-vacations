import { notFound } from 'next/navigation';
import { readFileSync } from 'fs';
import { join } from 'path';
import Papa from 'papaparse';
import Link from 'next/link';
import { formatDateRange } from '@/lib/date-utils';
import { NavigationCards } from '@/components/vacation/NavigationCards';
import type { Vacation } from '@/types/vacation';

async function getVacation(id: string): Promise<Vacation | null> {
  try {
    const text = readFileSync(join(process.cwd(), 'public', 'data', 'vacations.csv'), 'utf-8');
    const { data } = Papa.parse<Vacation>(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
    return data.find((v) => v.id === id && v.status === 'published') ?? null;
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ vacation: string }>;
}

export default async function VacationPage({ params }: PageProps) {
  const { vacation: id } = await params;
  const vacation = await getVacation(id);
  if (!vacation) notFound();

  const year = new Date(vacation.start_date).getFullYear();

  return (
    <div style={{ backgroundColor: 'var(--a-bg)', minHeight: '100vh' }}>

      {/* ── Back nav ─────────────────────────────────────────────── */}
      <div className="px-8 lg:px-16 xl:px-24 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-wide transition-colors hover:opacity-100 opacity-60"
          style={{ color: 'var(--a-muted)' }}
        >
          <span>←</span>
          <span>All adventures</span>
        </Link>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <header className="px-8 lg:px-16 xl:px-24 pt-10 pb-16">

        {/* Country / flag */}
        <p className="text-xs uppercase tracking-[0.35em] mb-8 flex items-center gap-2" style={{ color: 'var(--a-muted)' }}>
          <span>{vacation.flag_emoji}</span>
          <span>{vacation.country}</span>
        </p>

        {/* Destination + year */}
        <div className="flex items-end justify-between gap-8 mb-6">
          <h1
            className="font-display font-semibold leading-[0.9] tracking-tight"
            style={{
              color: 'var(--a-text)',
              fontSize: 'clamp(4.5rem, 12vw, 11rem)',
            }}
          >
            {vacation.name}
          </h1>
          <span
            className="font-display font-semibold leading-none hidden lg:block flex-shrink-0 select-none"
            style={{
              color: 'var(--a-dim)',
              fontSize: 'clamp(3rem, 6vw, 7rem)',
              opacity: 0.15,
              letterSpacing: '-0.02em',
              paddingBottom: '0.1em',
            }}
          >
            {year}
          </span>
        </div>

        {/* Tagline */}
        <p
          className="font-display italic leading-relaxed mb-10"
          style={{ color: 'var(--a-muted)', fontSize: 'clamp(1.05rem, 2vw, 1.35rem)', maxWidth: '40rem' }}
        >
          &ldquo;{vacation.tagline}&rdquo;
        </p>

        {/* Metadata strip */}
        <div
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm pt-6 border-t"
          style={{ borderColor: 'var(--a-border)', color: 'var(--a-muted)' }}
        >
          <span>{formatDateRange(vacation.start_date, vacation.end_date)}</span>
          <span style={{ color: 'var(--a-dim)' }}>·</span>
          <span>{vacation.days_count} days</span>
          <span style={{ color: 'var(--a-dim)' }}>·</span>
          <span>{vacation.people_count} {vacation.people_count === 1 ? 'traveller' : 'travellers'}</span>
          <span style={{ color: 'var(--a-dim)' }}>·</span>
          <span>{vacation.currency_code}</span>
        </div>
      </header>

      {/* ── Full-width divider ────────────────────────────────────── */}
      <div className="px-8 lg:px-16 xl:px-24 mb-10">
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--a-border)' }} />
          <span className="text-xs tracking-[0.3em] uppercase flex-shrink-0" style={{ color: 'var(--a-dim)' }}>
            This trip
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--a-border)' }} />
        </div>
      </div>

      {/* ── Nav cards ────────────────────────────────────────────── */}
      <NavigationCards vacation={vacation} />

      {/* ── Summary ──────────────────────────────────────────────── */}
      <section className="px-8 lg:px-16 xl:px-24 pb-24 mt-12">
        <p
          className="text-base leading-relaxed"
          style={{ color: 'var(--a-muted)', maxWidth: '44rem' }}
        >
          {vacation.summary}
        </p>
      </section>

    </div>
  );
}
