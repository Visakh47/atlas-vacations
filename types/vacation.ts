export type VacationStatus = 'published' | 'draft' | 'view_only' | 'upcoming';

export interface Vacation {
  id: string;
  name: string;
  country: string;
  flag_emoji: string;
  start_date: string;
  end_date: string;
  days_count: number;
  people_count: number;
  tagline: string;
  status: VacationStatus;
  currency_code: string;
  currency_symbol: string;
  summary: string;
}
