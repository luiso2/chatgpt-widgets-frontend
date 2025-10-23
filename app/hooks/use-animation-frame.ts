"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Hook to run callback on every animation frame for smooth animations.
 *
 * @param callback - Function to call on each frame (receives deltaTime)
 * @param enabled - Enable/disable the animation loop (default: true)
 *
 * @example
 * ```tsx
 * const [position, setPosition] = useState(0);
 *
 * useAnimationFrame((deltaTime) => {
 *   setPosition((prev) => prev + deltaTime * 0.1);
 * });
 *
 * return <div style={{ transform: `translateX(${position}px)` }} />;
 * ```
 */
export function useAnimationFrame(
  callback: (deltaTime: number) => void,
  enabled: boolean = true
) {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callbackRef.current(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (enabled) {
      requestRef.current = requestAnimationFrame(animate);
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [enabled, animate]);
}

/**
 * Hook to create a smooth counter animation.
 *
 * @example
 * ```tsx
 * const count = useCountAnimation(1000, 2000); // Animate to 1000 over 2 seconds
 * return <div>{Math.round(count)}</div>;
 * ```
 */
export function useCountAnimation(
  target: number,
  duration: number = 1000
): number {
  const [current, setCurrent] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useAnimationFrame(
    (deltaTime) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = performance.now();
        startValueRef.current = current;
      }

      const elapsed = performance.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      const newValue = startValueRef.current + (target - startValueRef.current) * eased;

      setCurrent(newValue);

      if (progress >= 1) {
        startTimeRef.current = null;
      }
    },
    current !== target
  );

  useEffect(() => {
    startTimeRef.current = null;
  }, [target]);

  return current;
}
