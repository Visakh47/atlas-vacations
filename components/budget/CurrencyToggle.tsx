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
    { symbol: conversion.symbol, code: conversion.code, icon: '🏠', value: false },
    { symbol: nativeSymbol, code: nativeCode, icon: '✈️', value: true },
  ];

  return (
    <div
      className="flex items-center w-full rounded-2xl p-1.5 gap-1.5"
      style={{ backgroundColor: 'var(--a-raised)', border: '1px solid var(--a-border2)' }}
    >
      {options.map(({ symbol, code, icon, value }) => (
        <button
          key={code}
          onClick={() => showNative !== value && onToggle()}
          className="flex flex-1 items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl font-medium transition-all duration-200"
          style={
            showNative === value
              ? {
                  backgroundColor: 'var(--a-accent)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  boxShadow: '0 1px 4px rgba(180,83,9,0.25)',
                }
              : {
                  color: 'var(--a-muted)',
                  fontSize: '0.9rem',
                }
          }
        >
          <span style={{ fontSize: '1rem', lineHeight: 1 }}>{icon}</span>
          <span>{symbol} {code}</span>
        </button>
      ))}
    </div>
  );
}
