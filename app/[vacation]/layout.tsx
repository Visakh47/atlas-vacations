import { type ReactNode } from 'react';
import { readFileSync } from 'fs';
import { join } from 'path';
import Papa from 'papaparse';
import type { Vacation } from '@/types/vacation';

interface VacationLayoutProps {
  children: ReactNode;
  params: Promise<{ vacation: string }>;
}

export async function generateStaticParams() {
  try {
    const csvPath = join(process.cwd(), 'public', 'data', 'vacations.csv');
    const text = readFileSync(csvPath, 'utf-8');
    const { data } = Papa.parse<Vacation>(text, { header: true, skipEmptyLines: true });
    return data
      .filter((v) => v.status === 'published')
      .map((v) => ({ vacation: v.id }));
  } catch {
    return [];
  }
}

export default async function VacationLayout({ children }: VacationLayoutProps) {
  return <>{children}</>;
}
