'use client';

import { CURRENCY_CONVERSIONS } from '@/lib/currency-utils';

interface CurrencyToggleProps {
  nativeCode: string;
  nativeSymbol: string;
  showNative: boolean;
  onToggle: () => void;
}

export function CurrencyToggle({ nativeCode, nativeSymbol, showNative, onToggle }: CurrencyToggleProps) {
  const conversion = CURRENCY_CONVERSIONS[nativeCode];
  if (!conversion) return null;

  const options = [
    { label: `${conversion.symbol} ${conversion.code}`, value: false },
    { label: `${nativeSymbol} ${nativeCode}`, value: true },
  ];

  return (
    <div
      className="inline-flex items-center rounded-lg p-0.5 gap-0.5"
      style={{ backgroundColor: 'var(--a-surface)', border: '1px solid var(--a-border)' }}
    >
      {options.map(({ label, value }) => (
        <button
          key={label}
          onClick={() => showNative !== value && onToggle()}
          className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150"
          style={
            showNative === value
              ? { backgroundColor: 'var(--a-raised)', color: 'var(--a-text)', border: '1px solid var(--a-border2)' }
              : { color: 'var(--a-muted)', border: '1px solid transparent' }
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
