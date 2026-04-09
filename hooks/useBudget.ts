'use client';

import { useState, useEffect } from 'react';
import { fetchCSV } from '@/lib/csv-fetcher';
import { vacationDataUrl } from '@/lib/constants';
import type { BudgetEntry, BudgetLineItem, BudgetMetrics, BudgetDaySummary, BudgetCategorySummary, FixedCostEntry } from '@/types/budget';
import type { Category, SubCategory } from '@/types/category';

function computeMetrics(
  entries: BudgetEntry[],
  fixedCosts: FixedCostEntry[],
  peopleCount: number,
  daysCount: number,
  categories: Category[],
  subCategories: SubCategory[]
): BudgetMetrics {
  // ── Days summary ───────────────────────────────────────────────────
  const dayMap = new Map<number, BudgetEntry[]>();
  for (const e of entries) {
    const day = Number(e.day_number);
    if (!dayMap.has(day)) dayMap.set(day, []);
    dayMap.get(day)!.push(e);
  }

  const days_summary: BudgetDaySummary[] = Array.from(dayMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([day_number, items]) => ({
      day_number,
      date: items[0]?.date ?? '',
      total: items.reduce((s, i) => s + (Number(i.amount_total) || 0), 0),
      items,
    }));

  const daily_spend_total = days_summary.reduce((s, d) => s + d.total, 0);
  const fixed_costs_total = fixedCosts.reduce((s, f) => s + (Number(f.amount_total) || 0), 0);
  const grand_total = daily_spend_total + fixed_costs_total;

  const most_expensive_day = days_summary.reduce(
    (max, d) => (d.total > max.total ? d : max),
    days_summary[0] ?? { day_number: 0, date: '', total: 0, items: [] }
  );

  // ── Unified category map (daily + fixed costs) ─────────────────────
  // catMap: category_id → total amount
  // subCatMap: category_id → sub_category_id → total amount
  // subCatItemsMap: category_id → sub_category_id → BudgetLineItem[]
  const catMap = new Map<string, number>();
  const subCatMap = new Map<string, Map<string, number>>();
  const subCatItemsMap = new Map<string, Map<string, BudgetLineItem[]>>();

  function addToMaps(catId: string, subId: string, amt: number, item: BudgetLineItem) {
    catMap.set(catId, (catMap.get(catId) ?? 0) + amt);
    if (!subCatMap.has(catId)) subCatMap.set(catId, new Map());
    subCatMap.get(catId)!.set(subId, (subCatMap.get(catId)!.get(subId) ?? 0) + amt);
    if (!subCatItemsMap.has(catId)) subCatItemsMap.set(catId, new Map());
    if (!subCatItemsMap.get(catId)!.has(subId)) subCatItemsMap.get(catId)!.set(subId, []);
    subCatItemsMap.get(catId)!.get(subId)!.push(item);
  }

  // Daily budget entries
  for (const e of entries) {
    const amt = Number(e.amount_total) || 0;
    addToMaps(e.category_id, e.sub_category_id, amt, {
      item_name: e.item_name,
      amount_total: amt,
      notes: e.notes,
      is_fixed: false,
      day_number: Number(e.day_number),
      date: e.date,
    });
  }

  // Fixed cost entries
  for (const f of fixedCosts) {
    const amt = Number(f.amount_total) || 0;
    addToMaps(f.category_id, f.sub_category_id, amt, {
      item_name: f.item_name,
      amount_total: amt,
      notes: f.notes,
      is_fixed: true,
    });
  }

  // ── Build categories_summary ───────────────────────────────────────
  const categories_summary: BudgetCategorySummary[] = Array.from(catMap.entries())
    .map(([catId, total]) => {
      const cat = categories.find((c) => c.category_id === catId);
      const subEntries = Array.from(subCatMap.get(catId)?.entries() ?? []);

      const sub_categories = subEntries
        .map(([subId, subTotal]) => {
          const sub = subCategories.find(
            (s) => s.parent_category_id === catId && s.sub_category_id === subId
          );
          const items = subCatItemsMap.get(catId)?.get(subId) ?? [];
          return {
            sub_category_id: subId,
            sub_category_name: sub?.sub_category_name ?? subId,
            emoji: sub?.emoji ?? '•',
            total: subTotal,
            percentage: total > 0 ? Math.round((subTotal / total) * 100) : 0,
            items,
          };
        })
        .sort((a, b) => b.total - a.total);

      return {
        category_id: catId,
        category_name: cat?.category_name ?? catId,
        emoji: cat?.emoji ?? '•',
        hex_color: cat?.hex_color ?? '#888888',
        total,
        percentage: grand_total > 0 ? Math.round((total / grand_total) * 100) : 0,
        sub_categories,
      };
    })
    .sort((a, b) => b.total - a.total);

  return {
    grand_total,
    fixed_costs_total,
    daily_spend_total,
    avg_per_day: daysCount > 0 ? Math.round(daily_spend_total / daysCount) : 0,
    individual_share: peopleCount > 0 ? Math.round(grand_total / peopleCount) : grand_total,
    most_expensive_day,
    top_category: categories_summary[0] ?? null,
    days_summary,
    categories_summary,
  };
}

export function useBudget(
  vacationId: string,
  peopleCount: number,
  daysCount: number,
  categories: Category[],
  subCategories: SubCategory[]
) {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [fixedCostsTotal, setFixedCostsTotal] = useState(0);
  const [metrics, setMetrics] = useState<BudgetMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (categories.length === 0) return;

    Promise.all([
      fetchCSV<BudgetEntry>(vacationDataUrl(vacationId, 'budget.csv')),
      fetchCSV<FixedCostEntry>(vacationDataUrl(vacationId, 'fixed_costs.csv')),
    ])
      .then(([budgetData, fixedData]) => {
        const total = fixedData.reduce((s, f) => s + (Number(f.amount_total) || 0), 0);
        setFixedCostsTotal(total);
        setEntries(budgetData);
        setMetrics(computeMetrics(budgetData, fixedData, peopleCount, daysCount, categories, subCategories));
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [vacationId, peopleCount, daysCount, categories, subCategories]);

  return { entries, fixedCostsTotal, metrics, loading, error };
}
