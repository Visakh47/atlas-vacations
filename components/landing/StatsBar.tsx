import type { Vacation } from '@/types/vacation';

interface StatsBarProps {
  vacations: Vacation[];
}

export function StatsBar({ vacations }: StatsBarProps) {
  const published = vacations.filter((v) => v.status === 'published');
  const countries = new Set(published.map((v) => v.country)).size;
  const totalDays = published.reduce((s, v) => s + Number(v.days_count), 0);

  const stats = [
    { label: 'Destinations', value: published.length, emoji: '🗺️' },
    { label: 'Countries', value: countries, emoji: '🌍' },
    { label: 'Days Travelled', value: totalDays, emoji: '✈️' },
  ];

  return (
    <div className="flex items-center justify-center gap-8 md:gap-16 py-6">
      {stats.map((s, i) => (
        <div key={i} className="text-center">
          <div className="text-2xl mb-1">{s.emoji}</div>
          <div className="text-3xl font-bold text-white">{s.value}</div>
          <div className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
