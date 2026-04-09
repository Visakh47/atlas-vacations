'use client';

interface BudgetToggleProps {
  isIndividual: boolean;
  onToggle: () => void;
  peopleCount: number;
}

export function BudgetToggle({ isIndividual, onToggle, peopleCount }: BudgetToggleProps) {
  return (
    <div
      className="inline-flex items-center rounded-lg p-0.5 gap-0.5"
      style={{ backgroundColor: 'var(--a-surface)', border: '1px solid var(--a-border)' }}
    >
      {[
        { label: 'Per person', value: true },
        { label: `Total (${peopleCount})`, value: false },
      ].map(({ label, value }) => (
        <button
          key={label}
          onClick={() => isIndividual !== value && onToggle()}
          className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150"
          style={
            isIndividual === value
              ? { backgroundColor: 'var(--a-raised)', color: 'var(--a-text)', border: '1px solid var(--a-border2)' }
              : { color: 'var(--a-muted)' }
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
