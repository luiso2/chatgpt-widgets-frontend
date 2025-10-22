"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Dashboard from "@/components/widgets/Dashboard";
import Chart from "@/components/widgets/Chart";
import Table from "@/components/widgets/Table";
import Timeline from "@/components/widgets/Timeline";
import Comparison from "@/components/widgets/Comparison";

function WidgetContent() {
  const searchParams = useSearchParams();
  const [widgetData, setWidgetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        const type = searchParams.get("type");
        const title = searchParams.get("title");
        const data = searchParams.get("data");
        const labels = searchParams.get("labels");

        if (!type) {
          setError("No widget type specified. Use ?type=dashboard|chart|table|timeline|comparison");
          setLoading(false);
          return;
        }

        // If custom data provided via URL params, use it
        if (data) {
          const parsedData = JSON.parse(decodeURIComponent(data));
          const parsedLabels = labels ? JSON.parse(decodeURIComponent(labels)) : [];

          setWidgetData({
            type,
            title: title || "Widget",
            data: parsedData,
            labels: parsedLabels,
          });
        } else {
          // Fetch from API
          const response = await fetch(`/api/widgets?type=${type}`);
          const result = await response.json();

          if (result.success) {
            setWidgetData(result.widget);
          } else {
            setError(result.error || "Failed to load widget");
          }
        }
      } catch (err) {
        setError("Error loading widget data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWidget();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading widget...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const renderWidget = () => {
    if (!widgetData) return null;

    switch (widgetData.type) {
      case "dashboard":
        return <Dashboard title={widgetData.title} metrics={widgetData.metrics} />;

      case "chart":
        return (
          <Chart
            title={widgetData.title}
            type={widgetData.chartType || "bar"}
            data={widgetData.data}
            labels={widgetData.labels}
          />
        );

      case "table":
        return (
          <Table
            title={widgetData.title}
            headers={widgetData.headers}
            rows={widgetData.rows}
          />
        );

      case "timeline":
        return <Timeline title={widgetData.title} events={widgetData.events} />;

      case "comparison":
        return <Comparison title={widgetData.title} items={widgetData.items} />;

      default:
        return <div>Unknown widget type: {widgetData.type}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-8">
      <div className="container mx-auto max-w-6xl">
        {renderWidget()}

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function WidgetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading widget...</p>
          </div>
        </div>
      }
    >
      <WidgetContent />
    </Suspense>
  );
}
