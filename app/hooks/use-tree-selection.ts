"use client";

import { useState, useCallback } from "react";

/**
 * Hook to manage tree node selection with multi-select support.
 *
 * @param initialSelection - Initially selected node IDs
 * @param multiSelect - Enable multi-selection (default: false)
 * @returns Selection state and manipulation functions
 *
 * @example
 * ```tsx
 * const { selected, select, deselect, toggle, clear } = useTreeSelection([], true);
 *
 * // Select nodes
 * select("node-1");
 * select(["node-2", "node-3"]);
 *
 * // Toggle selection
 * toggle("node-4");
 * ```
 */
export function useTreeSelection(
  initialSelection: string[] = [],
  multiSelect: boolean = false
) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialSelection)
  );

  const select = useCallback(
    (nodeId: string | string[]) => {
      const ids = Array.isArray(nodeId) ? nodeId : [nodeId];

      setSelected((prev) => {
        const newSelected = multiSelect ? new Set(prev) : new Set<string>();
        ids.forEach((id) => newSelected.add(id));
        return newSelected;
      });
    },
    [multiSelect]
  );

  const deselect = useCallback((nodeId: string | string[]) => {
    const ids = Array.isArray(nodeId) ? nodeId : [nodeId];

    setSelected((prev) => {
      const newSelected = new Set(prev);
      ids.forEach((id) => newSelected.delete(id));
      return newSelected;
    });
  }, []);

  const toggle = useCallback(
    (nodeId: string) => {
      setSelected((prev) => {
        const newSelected = multiSelect ? new Set(prev) : new Set<string>();

        if (prev.has(nodeId)) {
          newSelected.delete(nodeId);
        } else {
          newSelected.add(nodeId);
        }

        return newSelected;
      });
    },
    [multiSelect]
  );

  const clear = useCallback(() => {
    setSelected(new Set());
  }, []);

  const selectAll = useCallback((nodeIds: string[]) => {
    setSelected(new Set(nodeIds));
  }, []);

  const isSelected = useCallback(
    (nodeId: string) => {
      return selected.has(nodeId);
    },
    [selected]
  );

  return {
    selected: Array.from(selected),
    selectedSet: selected,
    select,
    deselect,
    toggle,
    clear,
    selectAll,
    isSelected,
  };
}
