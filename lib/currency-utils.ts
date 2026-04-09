const NO_DECIMALS = ['IDR', 'JPY', 'KRW', 'VND', 'INR'];

/** Conversion map: vacation native currency → home currency (INR). 1 INR = 180 IDR. */
export const CURRENCY_CONVERSIONS: Record<string, { code: string; symbol: string; rate: number }> = {
  IDR: { code: 'INR', symbol: '₹', rate: 1 / 180 },
};

export function formatCurrency(
  amount: number,
  currencyCode: string,
  currencySymbol: string,
): string {
  const digits = NO_DECIMALS.includes(currencyCode) ? 0 : 2;
  return `${currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

export function formatCurrencyAbbrev(amount: number, currencySymbol: string): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) {
    return `${currencySymbol}${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 1_000) {
    const k = amount / 1_000;
    const str = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1);
    return `${currencySymbol}${str}K`;
  }
  return `${currencySymbol}${Math.round(amount).toLocaleString()}`;
}
