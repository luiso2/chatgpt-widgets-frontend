"use client";

import { useState, useCallback } from "react";

/**
 * Hook to copy text to clipboard with success/error state.
 *
 * @param timeout - Time in ms to reset copied state (default: 2000)
 * @returns Copy function, copied state, and error
 *
 * @example
 * ```tsx
 * const { copy, copied, error } = useClipboard();
 *
 * return (
 *   <button onClick={() => copy("Text to copy")}>
 *     {copied ? "Copied!" : "Copy"}
 *   </button>
 * );
 * ```
 */
export function useClipboard(timeout: number = 2000) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        if (!navigator?.clipboard) {
          throw new Error("Clipboard API not supported");
        }

        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);

        setTimeout(() => {
          setCopied(false);
        }, timeout);
      } catch (err) {
        setError(err as Error);
        setCopied(false);
      }
    },
    [timeout]
  );

  const copyHtml = useCallback(
    async (html: string, plainText?: string) => {
      try {
        if (!navigator?.clipboard) {
          throw new Error("Clipboard API not supported");
        }

        const blob = new Blob([html], { type: "text/html" });
        const textBlob = new Blob([plainText || html], { type: "text/plain" });

        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": blob,
            "text/plain": textBlob,
          }),
        ]);

        setCopied(true);
        setError(null);

        setTimeout(() => {
          setCopied(false);
        }, timeout);
      } catch (err) {
        setError(err as Error);
        setCopied(false);
      }
    },
    [timeout]
  );

  return {
    copy,
    copyHtml,
    copied,
    error,
  };
}
