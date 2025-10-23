"use client";

import { useWidgetProps, useMaxHeight, useDisplayMode, useIsChatGptApp } from "@/app/hooks";
import Kanban from "@/components/widgets/Kanban";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';

export default function KanbanWidget() {
  const searchParams = useSearchParams();
  const widgetId = searchParams.get("id");

  const [urlData, setUrlData] = useState<any>(null);

  // Fetch data from URL params if id is present
  useEffect(() => {
    if (widgetId) {
      fetch(`/api/widgets?id=${widgetId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.widget) {
            setUrlData(data.widget);
          }
        })
        .catch(err => console.error("Error fetching widget data:", err));
    }
  }, [widgetId]);

  // Try MCP data first (for inline rendering)
  const toolOutput = useWidgetProps<{
    result?: { structuredContent?: {
      title?: string;
      columns?: Array<{
        id: string;
        title: string;
        color?: string;
        cards: Array<{
          id: string;
          title: string;
          description?: string;
          assignee?: string;
          dueDate?: string;
          tags?: string[];
          priority?: "low" | "medium" | "high";
        }>;
      }>;
    }};
  }>();

  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();
  const isChatGptApp = useIsChatGptApp();

  // Use MCP data if available, otherwise use URL data
  const data = toolOutput?.result?.structuredContent || urlData;

  if (!data || !data.title || !data.columns) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center"
        style={{ maxHeight, height: displayMode === "fullscreen" ? maxHeight : undefined }}
      >
        <div className="text-center max-w-md px-6">
          {!isChatGptApp ? (
            <>
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Preview Mode</h2>
              <p className="text-gray-600">This widget requires data from ChatGPT.</p>
              <p className="text-sm text-gray-500 mt-4">window.openai not detected</p>
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading kanban board...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6"
      style={{ maxHeight, height: displayMode === "fullscreen" ? maxHeight : undefined }}
    >
      <Kanban
        title={data.title}
        columns={data.columns}
      />
    </div>
  );
}
