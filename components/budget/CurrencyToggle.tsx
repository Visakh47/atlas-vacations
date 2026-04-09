'use client';

import { CURRENCY_CONVERSIONS } from '@/lib/currency-utils';

interface CurrencyToggleProps {
  nativeCode: string;
  nativeSymbol: string;
  showNative: boolean;
  onToggle: () => void;
  compact?: boolean;
}

export function CurrencyToggle({ nativeCode, nativeSymbol, showNative, onToggle, compact = false }: CurrencyToggleProps) {
  const conversion = CURRENCY_CONVERSIONS[nativeCode];
  if (!conversion) return null;

  const options = [
    { symbol: conversion.symbol, code: conversion.code, icon: '🏠', value: false },
    { symbol: nativeSymbol, code: nativeCode, icon: '✈️', value: true },
  ];

  return (
    <div
      className="flex items-center rounded-2xl gap-1"
      style={{
        backgroundColor: 'var(--a-raised)',
        border: '1px solid var(--a-border2)',
        padding: compact ? '4px' : '6px',
      }}
    >
      {options.map(({ symbol, code, icon, value }) => (
        <button
          key={code}
          onClick={() => showNative !== value && onToggle()}
          className="flex flex-1 items-center justify-center rounded-xl font-medium transition-all duration-200 whitespace-nowrap"
          style={{
            gap: compact ? '6px' : '10px',
            padding: compact ? '6px 12px' : '10px 20px',
            fontSize: compact ? '0.8rem' : '0.9rem',
            ...(showNative === value
              ? { backgroundColor: 'var(--a-accent)', color: '#fff', boxShadow: '0 1px 4px rgba(180,83,9,0.25)' }
              : { color: 'var(--a-muted)' }),
          }}
        >
          <span style={{ fontSize: compact ? '0.85rem' : '1rem', lineHeight: 1 }}>{icon}</span>
          <span>{symbol} {code}</span>
        </button>
      ))}
    </div>
  );
}
