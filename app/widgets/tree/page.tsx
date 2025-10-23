"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Tree from "@/components/widgets/Tree";
import { useWidgetProps, type TreeNode } from "@/app/hooks";

interface TreeWidgetData {
  title?: string;
  data: TreeNode[];
  expandAll?: boolean;
  multiSelect?: boolean;
  showSearch?: boolean;
  variant?: "default" | "premium" | "minimal" | "neon";
}

function TreeWidgetContent() {
  const searchParams = useSearchParams();
  const widgetId = searchParams.get("id");

  const [widgetData, setWidgetData] = useState<TreeWidgetData | null>(null);
  const [loading, setLoading] = useState(true);

  // Try to get data from MCP first
  const mcpData = useWidgetProps<TreeWidgetData>();

  useEffect(() => {
    const fetchData = async () => {
      if (mcpData && mcpData.data) {
        setWidgetData(mcpData);
        setLoading(false);
        return;
      }

      if (widgetId) {
        try {
          const response = await fetch(`/api/widgets?id=${widgetId}`);
          const result = await response.json();

          if (result.success && result.widget) {
            setWidgetData(result.widget);
          }
        } catch (error) {
          console.error("Error fetching widget data:", error);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [widgetId, mcpData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading Tree Widget...</p>
        </div>
      </div>
    );
  }

  if (!widgetData || !widgetData.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <p className="text-red-400 text-xl font-semibold mb-2">No tree data available</p>
          <p className="text-gray-400">Please provide valid tree data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Tree
        title={widgetData.title}
        data={widgetData.data}
        expandAll={widgetData.expandAll}
        multiSelect={widgetData.multiSelect}
        showSearch={widgetData.showSearch}
        variant={widgetData.variant || "premium"}
      />
    </div>
  );
}

export default function TreeWidgetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <TreeWidgetContent />
    </Suspense>
  );
}
