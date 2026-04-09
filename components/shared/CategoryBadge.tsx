interface CategoryBadgeProps {
  emoji: string;
  name: string;
  color?: string;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ emoji, name, color = '#888', size = 'sm' }: CategoryBadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClass}`}
      style={{ backgroundColor: `${color}22`, color }}
    >
      <span>{emoji}</span>
      <span>{name}</span>
    </span>
  );
}
