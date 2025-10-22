"use client";

import { useEffect, useState } from "react";
import Table from "@/components/widgets/Table";

export default function TableWidget() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Check if window.openai is available (running in ChatGPT)
    if (typeof window !== "undefined" && (window as any).openai) {
      const openai = (window as any).openai;

      // Get tool output data
      if (openai.getToolOutput) {
        openai.getToolOutput().then((output: any) => {
          const structuredContent = output?.result?.structuredContent;
          if (structuredContent) {
            setData(structuredContent);
          }
        });
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading table...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <Table
        title={data.title}
        headers={data.headers}
        rows={data.rows}
      />
    </div>
  );
}
