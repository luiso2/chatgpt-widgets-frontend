"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Dashboard from "@/components/widgets/Dashboard";

export default function DashboardWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const widgetId = searchParams.get("id");

  useEffect(() => {
    const loadWidgetData = async () => {
      try {
        // Priority 1: Load from widget ID (for direct URL access)
        if (widgetId) {
          const response = await fetch(`/api/widgets?id=${widgetId}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.widget) {
              setData(result.widget);
              setLoading(false);
              return;
            }
          }
          throw new Error("Widget not found");
        }

        // Priority 2: Check if window.openai is available (running in ChatGPT MCP)
        if (typeof window !== "undefined" && (window as any).openai) {
          const openai = (window as any).openai;
          if (openai.getToolOutput) {
            const output = await openai.getToolOutput();
            const structuredContent = output?.result?.structuredContent;
            if (structuredContent) {
              setData(structuredContent);
              setLoading(false);
              return;
            }
          }
        }

        // No data source available
        throw new Error("No widget data available");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load widget");
        setLoading(false);
      }
    };

    loadWidgetData();
  }, [widgetId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Widget Not Found</h2>
          <p className="text-gray-600">{error || "Unable to load widget data"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <Dashboard title={data.title} metrics={data.metrics} />
    </div>
  );
}
