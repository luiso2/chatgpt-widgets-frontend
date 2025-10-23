"use client";

import { useEffect, useRef, useCallback } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  preventDefault?: boolean;
}

/**
 * Hook to register keyboard shortcuts with modifier support.
 *
 * @param shortcut - Keyboard shortcut configuration
 * @param callback - Function to call when shortcut is triggered
 * @param enabled - Enable/disable the shortcut (default: true)
 *
 * @example
 * ```tsx
 * // Ctrl+S or Cmd+S to save
 * useKeyboardShortcut(
 *   { key: "s", ctrl: true, meta: true, preventDefault: true },
 *   () => handleSave()
 * );
 *
 * // Shift+? to show help
 * useKeyboardShortcut(
 *   { key: "?", shift: true },
 *   () => setShowHelp(true)
 * );
 * ```
 */
export function useKeyboardShortcut(
  shortcut: KeyboardShortcut,
  callback: () => void,
  enabled: boolean = true
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrl, shift, alt, meta, preventDefault = false } = shortcut;

      const isMatch =
        event.key.toLowerCase() === key.toLowerCase() &&
        (!ctrl || event.ctrlKey) &&
        (!shift || event.shiftKey) &&
        (!alt || event.altKey) &&
        (!meta || event.metaKey);

      if (isMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callbackRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcut, enabled]);
}

/**
 * Hook to register multiple keyboard shortcuts at once.
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts([
 *   { shortcut: { key: "s", ctrl: true }, handler: handleSave },
 *   { shortcut: { key: "Escape" }, handler: handleClose },
 *   { shortcut: { key: "k", ctrl: true, shift: true }, handler: openCommandPalette }
 * ]);
 * ```
 */
export function useKeyboardShortcuts(
  shortcuts: Array<{ shortcut: KeyboardShortcut; handler: () => void }>,
  enabled: boolean = true
) {
  shortcuts.forEach(({ shortcut, handler }) => {
    useKeyboardShortcut(shortcut, handler, enabled);
  });
}

/**
 * Format shortcut for display (e.g., "Ctrl+S" or "Cmd+K")
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  const isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.platform);

  if (shortcut.ctrl) parts.push(isMac ? "⌃" : "Ctrl");
  if (shortcut.alt) parts.push(isMac ? "⌥" : "Alt");
  if (shortcut.shift) parts.push(isMac ? "⇧" : "Shift");
  if (shortcut.meta) parts.push(isMac ? "⌘" : "Win");
  parts.push(shortcut.key.toUpperCase());

  return parts.join(isMac ? "" : "+");
}
