'use client';

import { type ReactNode } from 'react';
import { themeToStyle, fontStyleToClass } from '@/lib/theme-utils';
import type { VacationTheme } from '@/types/theme';

interface ThemeProviderProps {
  theme: VacationTheme;
  children: ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <div
      style={{
        ...themeToStyle(theme),
        backgroundColor: 'var(--color-bg)',
      }}
      className={`min-h-screen ${fontStyleToClass(theme.font_style)}`}
    >
      {children}
    </div>
  );
}
