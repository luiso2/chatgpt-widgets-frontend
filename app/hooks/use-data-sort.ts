"use client";

import { useState, useMemo, useCallback } from "react";

export type SortDirection = "asc" | "desc" | null;
export type SortFunction<T> = (a: T, b: T) => number;

/**
 * Hook to sort data with multiple sort keys and directions.
 *
 * @param data - Array of items to sort
 * @param initialKey - Initial sort key
 * @param initialDirection - Initial sort direction
 * @returns Sorted data and sort management functions
 *
 * @example
 * ```tsx
 * const { sortedData, sortBy, sortDirection, toggleSort } = useDataSort(users);
 *
 * // Sort by name ascending
 * setSortBy("name", "asc");
 *
 * // Toggle sort direction
 * toggleSort("age");
 * ```
 */
export function useDataSort<T>(
  data: T[],
  initialKey: string | null = null,
  initialDirection: SortDirection = "asc"
) {
  const [sortKey, setSortKey] = useState<string | null>(initialKey);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(initialDirection);
  const [customSortFn, setCustomSortFn] = useState<SortFunction<T> | null>(
    null
  );

  const sortedData = useMemo(() => {
    if (!sortKey && !customSortFn) return data;

    const sorted = [...data].sort((a, b) => {
      if (customSortFn) {
        return customSortFn(a, b);
      }

      if (!sortKey) return 0;

      const aValue = (a as Record<string, unknown>)[sortKey];
      const bValue = (b as Record<string, unknown>)[sortKey];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === "desc" ? -comparison : comparison;
    });

    return sorted;
  }, [data, sortKey, sortDirection, customSortFn]);

  const setSortBy = useCallback(
    (key: string | null, direction: SortDirection = "asc") => {
      setSortKey(key);
      setSortDirection(direction);
      setCustomSortFn(null);
    },
    []
  );

  const toggleSort = useCallback((key: string) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDirection((prevDirection) => {
          if (prevDirection === "asc") return "desc";
          if (prevDirection === "desc") return null;
          return "asc";
        });
        return key;
      } else {
        setSortDirection("asc");
        return key;
      }
    });
    setCustomSortFn(null);
  }, []);

  const setCustomSort = useCallback((sortFn: SortFunction<T>) => {
    setCustomSortFn(() => sortFn);
    setSortKey(null);
  }, []);

  const clearSort = useCallback(() => {
    setSortKey(null);
    setSortDirection(null);
    setCustomSortFn(null);
  }, []);

  return {
    sortedData,
    sortKey,
    sortDirection,
    setSortBy,
    toggleSort,
    setCustomSort,
    clearSort,
  };
}
