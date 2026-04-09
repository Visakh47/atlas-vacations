'use client';

export type ViewMode = 'category' | 'day' | 'all';

const MODES: { key: ViewMode; label: string }[] = [
  { key: 'category', label: 'Categories' },
  { key: 'day', label: 'By Day' },
  { key: 'all', label: 'All Items' },
];

export function ViewModeSelector({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div className="flex items-center gap-1">
      {MODES.map((m) => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
          style={
            mode === m.key
              ? { backgroundColor: 'var(--a-raised)', color: 'var(--a-text)', border: '1px solid var(--a-border2)' }
              : { color: 'var(--a-muted)', border: '1px solid transparent' }
          }
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
