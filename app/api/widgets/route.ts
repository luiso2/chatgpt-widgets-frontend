import { NextResponse } from "next/server";
import { baseURL } from "@/baseUrl";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// Backend API URL
const BACKEND_API_URL = "https://gpt-widget-production.up.railway.app";

// In-memory widget storage (in production, use Redis or database)
const widgetStore = new Map<string, any>();

// Widget type mapping to backend endpoints
const WIDGET_ENDPOINTS: Record<string, string> = {
  dashboard: "/api/widget/dashboard",
  chart: "/api/widget/chart",
  table: "/api/widget/table",
  timeline: "/api/widget/timeline",
  comparison: "/api/widget/comparison",
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

    if (!WIDGET_ENDPOINTS[type]) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid widget type. Available types: ${Object.keys(WIDGET_ENDPOINTS).join(", ")}`
        },
        { status: 400 }
      );
    }

    // Call backend API
    const backendUrl = `${BACKEND_API_URL}${WIDGET_ENDPOINTS[type]}`;

    // For chart widgets, map chartType to type for backend
    const backendPayload = type === "chart" && chartType
      ? { ...widgetData, type: chartType }
      : widgetData;

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendPayload),
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend returned ${backendResponse.status}`);
    }

    const backendData = await backendResponse.json();

    // Generate unique widget ID
    const widgetId = crypto.randomBytes(16).toString("hex");

    // Store widget data for visual rendering
    const widgetWithType = { type, chartType, ...widgetData };
    widgetStore.set(widgetId, widgetWithType);

    // Generate widget URL based on type
    const widgetPath = `/widgets/${type}?id=${widgetId}`;
    const widgetUrl = `${baseURL}${widgetPath}`;

    // Return both visual URL and markdown fallback
    return NextResponse.json({
      success: true,
      widgetUrl: widgetUrl,
      markdown: backendData.content,
      content: backendData.content,
      type: "visual-widget",
      widget: widgetWithType,
      message: "Visual widget created! ChatGPT will display this as an interactive chart/visualization.",
    });
  } catch (error) {
    console.error("Error calling backend:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al conectar con el backend. Verifica que el backend esté disponible.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
