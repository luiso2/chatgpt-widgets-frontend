"use client";

import { useWidgetProps, useMaxHeight, useDisplayMode, useIsChatGptApp } from "@/app/hooks";
import Chart from "@/components/widgets/Chart";

export const dynamic = 'force-dynamic';

export default function ChartWidget() {
  const toolOutput = useWidgetProps<{
    result?: { structuredContent?: {
      title?: string;
      chartType?: "bar" | "line" | "pie" | "doughnut";
      data?: number[];
      labels?: string[];
    }};
  }>();

  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();
  const isChatGptApp = useIsChatGptApp();

  const data = toolOutput?.result?.structuredContent;

  if (!data || !data.title || !data.data || !data.labels) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center"
        style={{ maxHeight, height: displayMode === "fullscreen" ? maxHeight : undefined }}
      >
        <div className="text-center max-w-md px-6">
          {!isChatGptApp ? (
            <>
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Preview Mode</h2>
              <p className="text-gray-600">This widget requires data from ChatGPT.</p>
              <p className="text-sm text-gray-500 mt-4">window.openai not detected</p>
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading chart...</p>
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
      <Chart
        title={data.title}
        type={data.chartType || "bar"}
        data={data.data}
        labels={data.labels}
      />
    </div>
  );
}
