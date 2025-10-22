import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Sample data - In production, this would come from a database
const widgetsData = {
  dashboard: {
    type: "dashboard",
    title: "Dashboard de Ventas",
    metrics: [
      {
        value: "$125,430",
        label: "Ingresos Totales",
        color: "text-green-600",
        change: "+18%",
      },
      {
        value: "12,430",
        label: "Usuarios Activos",
        color: "text-blue-600",
        change: "+25%",
      },
      {
        value: "1,234",
        label: "Nuevos Registros",
        color: "text-purple-600",
        change: "+15%",
      },
    ],
  },
  chart: {
    type: "chart",
    title: "Ventas Mensuales",
    chartType: "bar",
    data: [15000, 22000, 18000, 28000, 32000, 25000],
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  },
  table: {
    type: "table",
    title: "Top Productos",
    headers: ["Producto", "Categoría", "Ventas", "Stock", "Estado"],
    rows: [
      ["iPhone 15 Pro", "Tecnología", "$89,450", "125", "Activo"],
      ["MacBook Air M3", "Computadoras", "$145,320", "45", "Activo"],
      ["AirPods Pro 2", "Audio", "$34,890", "234", "Activo"],
    ],
  },
  timeline: {
    type: "timeline",
    title: "Historia del Proyecto",
    events: [
      {
        date: "15 Enero 2025",
        title: "Lanzamiento Beta",
        description: "Primera versión beta lanzada al público.",
        color: "blue",
      },
      {
        date: "1 Marzo 2025",
        title: "Versión 1.0",
        description: "Lanzamiento oficial con características principales.",
        color: "green",
      },
    ],
  },
  comparison: {
    type: "comparison",
    title: "Comparación de Planes",
    items: [
      {
        name: "Plan Básico",
        price: "$9/mes",
        features: ["5 usuarios", "10GB almacenamiento", "Soporte por email"],
        highlight: false,
      },
      {
        name: "Plan Pro",
        price: "$29/mes",
        features: [
          "Usuarios ilimitados",
          "100GB almacenamiento",
          "Soporte 24/7",
          "API Access",
        ],
        highlight: true,
      },
    ],
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  // If type is specified, return that widget
  if (type && widgetsData[type as keyof typeof widgetsData]) {
    return NextResponse.json({
      success: true,
      widget: widgetsData[type as keyof typeof widgetsData],
    });
  }

  // Otherwise return all available widgets
  return NextResponse.json({
    success: true,
    widgets: Object.keys(widgetsData),
    data: widgetsData,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, ...customData } = body;

    // If no type specified, return error
    if (!type) {
      return NextResponse.json(
        { success: false, error: "Widget type is required" },
        { status: 400 }
      );
    }

    // Return the requested widget with custom data if provided
    const baseWidget = widgetsData[type as keyof typeof widgetsData];

    if (!baseWidget) {
      return NextResponse.json(
        { success: false, error: "Invalid widget type" },
        { status: 400 }
      );
    }

    // Merge custom data with base widget
    const widget = { ...baseWidget, ...customData };

    return NextResponse.json({
      success: true,
      widget,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://frontend-production-d329.up.railway.app'}/widget/${type}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
