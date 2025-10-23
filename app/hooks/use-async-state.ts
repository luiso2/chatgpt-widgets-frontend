"use client";

import { useState, useCallback } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to manage async operations with loading/error states.
 *
 * @param asyncFunction - Async function to execute
 * @param immediate - Execute immediately on mount (default: false)
 * @returns State object and execute function
 *
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useAsyncState(
 *   async (userId: string) => {
 *     const response = await fetch(`/api/users/${userId}`);
 *     return response.json();
 *   }
 * );
 *
 * return (
 *   <div>
 *     {loading && <Spinner />}
 *     {error && <Error message={error.message} />}
 *     {data && <UserProfile user={data} />}
 *     <button onClick={() => execute("123")}>Load User</button>
 *   </div>
 * );
 * ```
 */
export function useAsyncState<T, Args extends unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  immediate: boolean = false
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({ data: null, loading: true, error: null });

      try {
        const data = await asyncFunction(...args);
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        setState({ data: null, loading: false, error: error as Error });
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
