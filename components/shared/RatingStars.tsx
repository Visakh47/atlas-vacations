export function RatingStars({ rating, max = 5 }: { rating: number; max?: number }) {
  if (!rating) return null;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className="text-xs" style={{ color: i < rating ? 'var(--a-accent2)' : 'var(--a-border2)' }}>
          ★
        </span>
      ))}
    </span>
  );
}
