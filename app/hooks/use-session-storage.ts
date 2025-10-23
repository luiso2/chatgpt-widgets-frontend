"use client";

import { useState, useCallback } from "react";

/**
 * Hook to sync state with sessionStorage (cleared when tab closes).
 *
 * @param key - SessionStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Stateful value and setter function
 *
 * @example
 * ```tsx
 * const [formData, setFormData] = useSessionStorage("form", {});
 *
 * // Persists during session, cleared on tab close
 * setFormData({ step: 2, email: "user@example.com" });
 * ```
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          if (valueToStore === null || valueToStore === undefined) {
            window.sessionStorage.removeItem(key);
          } else {
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
          }
        }
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const remove = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, remove];
}
