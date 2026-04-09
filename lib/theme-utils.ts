import type { VacationTheme } from '@/types/theme';
import type { CSSProperties } from 'react';

export function themeToStyle(theme: VacationTheme): CSSProperties {
  return {
    '--color-primary': theme.primary_color,
    '--color-secondary': theme.secondary_color,
    '--color-accent': theme.accent_color,
    '--color-bg': theme.bg_color,
    '--color-text-on-primary': theme.text_on_primary,
    '--gradient-from': theme.gradient_from,
    '--gradient-to': theme.gradient_to,
    '--color-card-bg': theme.card_bg,
  } as CSSProperties;
}

export function fontStyleToClass(style: string): string {
  const map: Record<string, string> = {
    modern: 'font-sans',
    serif: 'font-serif',
    tropical: 'font-sans',
    alpine: 'font-serif',
  };
  return map[style] ?? 'font-sans';
}

export const DEFAULT_THEME: VacationTheme = {
  primary_color: '#3B82F6',
  secondary_color: '#8B5CF6',
  accent_color: '#10B981',
  bg_color: '#F9FAFB',
  text_on_primary: '#FFFFFF',
  gradient_from: '#3B82F6',
  gradient_to: '#8B5CF6',
  card_bg: '#FFFFFF',
  font_style: 'modern',
};
