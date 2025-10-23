"use client";

import { useState, useCallback, useRef, DragEvent } from "react";

export interface DragDropOptions {
  onDrop?: (data: unknown, event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragEnter?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
}

/**
 * Hook to handle drag and drop functionality with visual feedback.
 *
 * @param options - Drag and drop event handlers
 * @returns Drag handlers and state
 *
 * @example
 * ```tsx
 * const { isDragging, dragHandlers } = useDragAndDrop({
 *   onDrop: (data) => {
 *     console.log("Dropped:", data);
 *   }
 * });
 *
 * return (
 *   <div
 *     {...dragHandlers}
 *     className={isDragging ? "border-blue-500" : ""}
 *   >
 *     Drop files here
 *   </div>
 * );
 * ```
 */
export function useDragAndDrop(options: DragDropOptions = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);

  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current++;
      setIsDragging(true);
      options.onDragEnter?.(e);
    },
    [options]
  );

  const handleDragLeave = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current--;
      if (dragCounterRef.current === 0) {
        setIsDragging(false);
      }
      options.onDragLeave?.(e);
    },
    [options]
  );

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      options.onDragOver?.(e);
    },
    [options]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounterRef.current = 0;

      const data = e.dataTransfer?.getData("text");
      const files = e.dataTransfer?.files;

      if (files && files.length > 0) {
        options.onDrop?.(Array.from(files), e);
      } else if (data) {
        try {
          const parsedData = JSON.parse(data);
          options.onDrop?.(parsedData, e);
        } catch {
          options.onDrop?.(data, e);
        }
      }
    },
    [options]
  );

  return {
    isDragging,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
}

/**
 * Hook to make an element draggable.
 *
 * @example
 * ```tsx
 * const draggableProps = useDraggable({
 *   id: "item-1",
 *   data: { name: "Item 1" }
 * });
 *
 * return <div {...draggableProps}>Drag me</div>;
 * ```
 */
export function useDraggable(data: { id: string; data?: unknown }) {
  const handleDragStart = useCallback(
    (e: DragEvent) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", JSON.stringify(data));
    },
    [data]
  );

  return {
    draggable: true,
    onDragStart: handleDragStart,
  };
}
