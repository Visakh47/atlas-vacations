import { readFileSync } from 'fs';
import { join } from 'path';
import Papa from 'papaparse';
import { VacationCard } from '@/components/landing/VacationCard';
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

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex-1 h-px" style={{ backgroundColor: 'var(--a-border)' }} />
      <span className="text-xs tracking-[0.3em] uppercase flex-shrink-0" style={{ color: 'var(--a-dim)' }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: 'var(--a-border)' }} />
    </div>
  );
}

export default async function HomePage() {
  const all = await getVacations();

  const adventures = all
    .filter(v => v.status === 'published' || v.status === 'view_only')
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  const upcoming = all.filter(v => v.status === 'upcoming');

  const countries = new Set(adventures.map(v => v.country)).size;
  const totalDays = adventures.reduce((s, v) => s + Number(v.days_count), 0);

  return (
    <main style={{ backgroundColor: 'var(--a-bg)' }} className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <header className="px-8 lg:px-16 xl:px-24 pt-16 lg:pt-24 pb-16">

        <p className="text-xs tracking-[0.35em] uppercase mb-10" style={{ color: 'var(--a-muted)' }}>
          Personal Travel Journal
        </p>

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

          <div className="flex lg:flex-col gap-8 lg:gap-7 lg:pb-2 lg:text-right flex-shrink-0">
            {[
              { n: adventures.length, label: 'Destinations' },
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

      {/* ── Adventures ───────────────────────────────────────────── */}
      <div className="px-8 lg:px-16 xl:px-24 mb-10">
        <Divider label="Adventures" />
      </div>

      <section className="px-8 lg:px-16 xl:px-24 pb-16 flex flex-col gap-4">
        {adventures.map(v => <VacationCard key={v.id} vacation={v} />)}
      </section>

      {/* ── Upcoming ─────────────────────────────────────────────── */}
      {upcoming.length > 0 && (
        <>
          <div className="px-8 lg:px-16 xl:px-24 mb-10">
            <Divider label="Upcoming" />
          </div>

          <section className="px-8 lg:px-16 xl:px-24 pb-28 flex flex-col gap-4">
            {upcoming.map(v => (
              <div
                key={v.id}
                className="rounded-2xl border px-8 py-7 flex items-center justify-between"
                style={{ backgroundColor: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] mb-3 flex items-center gap-2" style={{ color: 'var(--a-muted)' }}>
                    <span>{v.flag_emoji}</span>
                    <span>{v.country}</span>
                  </p>
                  <h3
                    className="font-display font-semibold leading-none tracking-tight"
                    style={{ color: 'var(--a-text)', fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                  >
                    {v.name}
                  </h3>
                </div>
                <span
                  className="text-xs border rounded-full px-3 py-1 flex-shrink-0"
                  style={{ color: 'var(--a-accent)', borderColor: 'var(--a-accent)', opacity: 0.7 }}
                >
                  Upcoming
                </span>
              </div>
            ))}
          </section>
        </>
      )}

    </main>
  );
}
