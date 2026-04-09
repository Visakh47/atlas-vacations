import { readFileSync } from 'fs';
import { join } from 'path';
import Papa from 'papaparse';
import { VacationGrid } from '@/components/landing/VacationGrid';
import type { Vacation } from '@/types/vacation';

async function getVacations(): Promise<Vacation[]> {
  try {
    const text = readFileSync(join(process.cwd(), 'public', 'data', 'vacations.csv'), 'utf-8');
    const { data } = Papa.parse<Vacation>(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
    return data;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const vacations = await getVacations();
  const published = vacations.filter(v => v.status === 'published');
  const countries = new Set(published.map(v => v.country)).size;
  const totalDays = published.reduce((s, v) => s + Number(v.days_count), 0);

  return (
    <main style={{ backgroundColor: 'var(--a-bg)' }} className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <header className="px-8 lg:px-16 xl:px-24 pt-16 lg:pt-24 pb-16">

        <p className="text-xs tracking-[0.35em] uppercase mb-10" style={{ color: 'var(--a-muted)' }}>
          Personal Travel Journal
        </p>

        {/* Title + stats side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">

          <div>
            <h1
              className="font-display font-semibold leading-[0.95] tracking-tight"
              style={{ color: 'var(--a-text)', fontSize: 'clamp(4rem, 10vw, 9rem)' }}
            >
              The Atlas<br />
              <span className="italic" style={{ color: 'var(--a-accent)' }}>of VB</span>
            </h1>
            <p className="text-base leading-relaxed max-w-sm mt-6" style={{ color: 'var(--a-muted)' }}>
              Every journey tells a story. A living record of adventures, one destination at a time.
            </p>
          </div>

          {/* Stats — right-aligned on desktop, row on mobile */}
          <div className="flex lg:flex-col gap-8 lg:gap-7 lg:pb-2 lg:text-right flex-shrink-0">
            {[
              { n: published.length, label: 'Destinations' },
              { n: countries, label: 'Countries' },
              { n: totalDays, label: 'Days away' },
            ].map(({ n, label }) => (
              <div key={label}>
                <p className="font-display font-semibold" style={{ color: 'var(--a-text)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1 }}>
                  {n}
                </p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--a-muted)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div className="px-8 lg:px-16 xl:px-24 mb-10">
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--a-border)' }} />
          <span className="text-xs tracking-[0.3em] uppercase flex-shrink-0" style={{ color: 'var(--a-dim)' }}>
            Adventures
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--a-border)' }} />
        </div>
      </div>

      {/* ── Destination grid ─────────────────────────────────────── */}
      <section className="px-8 lg:px-16 xl:px-24 pb-28">
        <VacationGrid vacations={vacations} />
      </section>

    </main>
  );
}
