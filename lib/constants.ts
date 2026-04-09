export const DATA_BASE = '/data';
export const VACATIONS_CSV = `${DATA_BASE}/vacations.csv`;
export const CATEGORIES_CSV = `${DATA_BASE}/lookup/categories.csv`;
export const CATEGORY_BREAKDOWN_CSV = `${DATA_BASE}/lookup/category_breakdown.csv`;

export function vacationDataUrl(id: string, file: string): string {
  return `${DATA_BASE}/vacations/${id}/${file}`;
}

export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
