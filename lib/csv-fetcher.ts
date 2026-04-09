import Papa from 'papaparse';
import { cacheManager } from './cache-manager';

export async function fetchCSV<T>(url: string, ttl?: number): Promise<T[]> {
  const cached = cacheManager.get<T[]>(url);
  if (cached) return cached;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CSV fetch failed: ${url} (${response.status})`);
  }
  const text = await response.text();

  const result = Papa.parse<T>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const data = result.data;
  cacheManager.set(url, data, ttl);
  return data;
}

export async function fetchJSON<T>(url: string, ttl?: number): Promise<T> {
  const cached = cacheManager.get<T>(url);
  if (cached) return cached;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`JSON fetch failed: ${url} (${response.status})`);
  }
  const data: T = await response.json();
  cacheManager.set(url, data, ttl);
  return data;
}
