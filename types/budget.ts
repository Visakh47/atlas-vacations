export interface BudgetEntry {
  day_number: number;
  date: string;
  item_name: string;
  category_id: string;
  sub_category_id: string;
  amount_total: number;
  currency: string;
  notes: string;
}

export interface FixedCostEntry {
  item_name: string;
  category_id: string;
  sub_category_id: string;
  amount_total: number;
  currency: string;
  notes: string;
}

export interface BudgetLineItem {
  item_name: string;
  amount_total: number;
  notes?: string;
  is_fixed: boolean;
  day_number?: number; // undefined for fixed costs
  date?: string;       // undefined for fixed costs
}

export interface BudgetDaySummary {
  day_number: number;
  date: string;
  total: number;
  items: BudgetEntry[];
}

export interface BudgetSubCategorySummary {
  sub_category_id: string;
  sub_category_name: string;
  emoji: string;
  total: number;
  percentage: number;
  items: BudgetLineItem[];
}

export interface BudgetCategorySummary {
  category_id: string;
  category_name: string;
  emoji: string;
  hex_color: string;
  total: number;
  percentage: number;
  sub_categories: BudgetSubCategorySummary[];
}

export interface BudgetMetrics {
  grand_total: number;
  fixed_costs_total: number;
  daily_spend_total: number;
  avg_per_day: number;
  individual_share: number;
  most_expensive_day: BudgetDaySummary;
  top_category: BudgetCategorySummary | null;
  days_summary: BudgetDaySummary[];
  categories_summary: BudgetCategorySummary[];
}
