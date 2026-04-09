'use client';

interface BudgetToggleProps {
  isIndividual: boolean;
  onToggle: () => void;
  peopleCount: number;
}

export function BudgetToggle({ isIndividual, onToggle, peopleCount }: BudgetToggleProps) {
  return (
    <div
      className="flex items-center w-full rounded-2xl p-1.5 gap-1.5"
      style={{ backgroundColor: 'var(--a-raised)', border: '1px solid var(--a-border2)' }}
    >
      {[
        { label: 'Per person', icon: '👤', value: true },
        { label: `Total (${peopleCount})`, icon: '👥', value: false },
      ].map(({ label, icon, value }) => (
        <button
          key={label}
          onClick={() => isIndividual !== value && onToggle()}
          className="flex flex-1 items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap"
          style={
            isIndividual === value
              ? {
                  backgroundColor: 'var(--a-accent)',
                  color: '#fff',
                  fontSize: '0.875rem',
                  boxShadow: '0 1px 4px rgba(180,83,9,0.25)',
                }
              : {
                  color: 'var(--a-muted)',
                  fontSize: '0.875rem',
                }
          }
        >
          <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
