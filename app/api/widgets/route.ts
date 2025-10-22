import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Backend API URL
const BACKEND_API_URL = "https://gpt-widget-production.up.railway.app";

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
  const type = searchParams.get("type");

  // Return available widget types
  return NextResponse.json({
    success: true,
    widgets: Object.keys(WIDGET_ENDPOINTS),
    message: "Usa POST /api/widgets con los datos del widget para crear visualizaciones",
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

    // Return the backend response with markdown content
    return NextResponse.json({
      success: true,
      markdown: backendData.content,
      type: backendData.type,
      widget: widgetData,
      message: "Widget generado exitosamente por el backend. Los datos se muestran en formato visual arriba.",
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
