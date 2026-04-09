'use client';

import { useState, useEffect } from 'react';
import { fetchCSV } from '@/lib/csv-fetcher';
import { CATEGORIES_CSV, CATEGORY_BREAKDOWN_CSV } from '@/lib/constants';
import type { Category, SubCategory } from '@/types/category';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    Promise.all([
      fetchCSV<Category>(CATEGORIES_CSV),
      fetchCSV<SubCategory>(CATEGORY_BREAKDOWN_CSV),
    ])
      .then(([cats, subs]) => {
        setCategories(cats);
        setSubCategories(subs);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  function getCategoryById(id: string): Category | undefined {
    return categories.find((c) => c.category_id === id);
  }

  function getSubCategoriesFor(parentId: string): SubCategory[] {
    return subCategories.filter((s) => s.parent_category_id === parentId);
  }

  function getSubCategoryById(parentId: string, subId: string): SubCategory | undefined {
    return subCategories.find(
      (s) => s.parent_category_id === parentId && s.sub_category_id === subId
    );
  }

  return { categories, subCategories, loading, error, getCategoryById, getSubCategoriesFor, getSubCategoryById };
}
