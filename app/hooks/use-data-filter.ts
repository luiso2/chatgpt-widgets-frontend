"use client";

import { useState, useMemo, useCallback } from "react";

export type FilterFunction<T> = (item: T) => boolean;

/**
 * Hook to filter data with multiple filter predicates.
 *
 * @param data - Array of items to filter
 * @param initialFilters - Initial filter functions
 * @returns Filtered data and filter management functions
 *
 * @example
 * ```tsx
 * const { filteredData, addFilter, removeFilter } = useDataFilter(users);
 *
 * // Add filter for active users
 * addFilter("active", (user) => user.isActive);
 *
 * // Add search filter
 * addFilter("search", (user) => user.name.includes(searchTerm));
 * ```
 */
export function useDataFilter<T>(
  data: T[],
  initialFilters: Map<string, FilterFunction<T>> = new Map()
) {
  const [filters, setFilters] = useState<Map<string, FilterFunction<T>>>(
    initialFilters
  );

  const filteredData = useMemo(() => {
    if (filters.size === 0) return data;

    return data.filter((item) => {
      return Array.from(filters.values()).every((filterFn) => filterFn(item));
    });
  }, [data, filters]);

  const addFilter = useCallback((key: string, filterFn: FilterFunction<T>) => {
    setFilters((prev) => {
      const newFilters = new Map(prev);
      newFilters.set(key, filterFn);
      return newFilters;
    });
  }, []);

  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const newFilters = new Map(prev);
      newFilters.delete(key);
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(new Map());
  }, []);

  const hasFilter = useCallback(
    (key: string) => {
      return filters.has(key);
    },
    [filters]
  );

  const updateFilter = useCallback(
    (key: string, filterFn: FilterFunction<T>) => {
      setFilters((prev) => {
        const newFilters = new Map(prev);
        newFilters.set(key, filterFn);
        return newFilters;
      });
    },
    []
  );

  return {
    filteredData,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    hasFilter,
    updateFilter,
    activeFiltersCount: filters.size,
  };
}
