"use client";

import { useRef, useCallback } from "react";

/**
 * Hook to throttle function calls with configurable interval.
 *
 * @param callback - Function to throttle
 * @param delay - Minimum time between calls in milliseconds (default: 500)
 * @returns Throttled function
 *
 * @example
 * ```tsx
 * const handleScroll = useThrottle(() => {
 *   console.log("Scroll position:", window.scrollY);
 * }, 200);
 *
 * useEffect(() => {
 *   window.addEventListener("scroll", handleScroll);
 *   return () => window.removeEventListener("scroll", handleScroll);
 * }, [handleScroll]);
 * ```
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 500
): T {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= delay) {
        callback(...args);
        lastRun.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(
          () => {
            callback(...args);
            lastRun.current = Date.now();
          },
          delay - timeSinceLastRun
        );
      }
    },
    [callback, delay]
  ) as T;
}
