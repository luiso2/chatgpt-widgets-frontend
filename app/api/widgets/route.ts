import { NextResponse } from "next/server";
import { baseURL } from "@/baseUrl";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// Backend API URL - use environment variable
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gpt-widget-production.up.railway.app";

// In-memory widget storage (in production, use Redis or database)
const widgetStore = new Map<string, any>();

// Widget type mapping to backend endpoints
const WIDGET_ENDPOINTS: Record<string, string> = {
  dashboard: "/api/widget/dashboard",
  chart: "/api/widget/chart",
  table: "/api/widget/table",
  timeline: "/api/widget/timeline",
  comparison: "/api/widget/comparison",
  tree: "/api/widget/tree",
  stats: "/api/widget/stats",
  progress: "/api/widget/progress",
  kanban: "/api/widget/kanban",
  calendar: "/api/widget/calendar",
  pricing: "/api/widget/pricing",
  gallery: "/api/widget/gallery",
  notifications: "/api/widget/notifications",
  activity: "/api/widget/activity",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // If ID provided, return widget data
  if (id) {
    const widgetData = widgetStore.get(id);
    if (!widgetData) {
      return NextResponse.json(
        { success: false, error: "Widget not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      widget: widgetData,
    });
  }

  // Return available widget types
  return NextResponse.json({
    success: true,
    widgets: Object.keys(WIDGET_ENDPOINTS),
    message: "Use POST /api/widgets to create visual widgets. Returns widgetUrl for iframe rendering.",
    backend: BACKEND_API_URL,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, chartType, ...widgetData } = body;

    // Validate widget type
    if (!type) {
      return NextResponse.json(
        { success: false, error: "Widget type is required" },
        { status: 400 }
      );
    }

    const validTypes = [
      "dashboard", "chart", "table", "timeline", "comparison", "tree",
      "stats", "progress", "kanban", "calendar", "pricing", "gallery",
      "notifications", "activity"
    ];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid widget type. Available types: ${validTypes.join(", ")}`
        },
        { status: 400 }
      );
    }

    // Generate unique widget ID
    const widgetId = crypto.randomBytes(16).toString("hex");

    // Store widget data for visual rendering
    const widgetWithType = { type, chartType, ...widgetData };
    widgetStore.set(widgetId, widgetWithType);

    // Generate widget URL based on type
    const widgetPath = `/widgets/${type}?id=${widgetId}`;
    const widgetUrl = `${baseURL}${widgetPath}`;

    // Return ONLY the widget URL - simple response for ChatGPT
    return NextResponse.json({
      widgetUrl: widgetUrl,
      title: widgetData.title || "Widget created",
      description: `Click the link above to view your interactive ${type} widget`
    });
  } catch (error) {
    console.error("Error creating widget:", error);
    return NextResponse.json(
      {
        error: "Failed to create widget",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
