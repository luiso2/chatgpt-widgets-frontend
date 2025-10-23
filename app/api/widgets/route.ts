import { NextResponse } from "next/server";
import { baseURL } from "@/baseUrl";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// Backend API URL - use environment variable
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gpt-widget-production.up.railway.app";

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

  // If ID provided, fetch widget data from backend
  if (id) {
    try {
      console.log(`🔍 Fetching widget data for ID: ${id} from backend`);

      // Try to fetch from backend API
      const backendUrl = `${BACKEND_API_URL}/api/widget/data/${id}`;
      console.log(`📡 Backend URL: ${backendUrl}`);

      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        console.error(`❌ Backend response not OK: ${response.status}`);

        // Fallback: Try alternative endpoint structure
        const altUrl = `${BACKEND_API_URL}/api/widgets/${id}`;
        console.log(`🔄 Trying alternative URL: ${altUrl}`);

        const altResponse = await fetch(altUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });

        if (altResponse.ok) {
          const data = await altResponse.json();
          console.log(`✅ Widget data retrieved from alternative endpoint`);

          // Normalize the response structure
          const widgetData = data.widget || data.data || data;

          return NextResponse.json({
            success: true,
            widget: widgetData,
          });
        }

        // If both attempts fail, return mock data for the widget ID
        console.log(`⚠️ Backend unavailable, using fallback data for demo`);

        // Generate demo data based on widget type from the referrer
        const referer = request.headers.get('referer') || '';
        let widgetType = 'table'; // default

        // Extract widget type from referer URL
        for (const type of Object.keys(WIDGET_ENDPOINTS)) {
          if (referer.includes(`/widgets/${type}`)) {
            widgetType = type;
            break;
          }
        }

        // Return appropriate demo data based on widget type
        const demoData = getDemoDataForType(widgetType, id);

        return NextResponse.json({
          success: true,
          widget: demoData,
          source: 'demo'
        });
      }

      const data = await response.json();
      console.log(`✅ Widget data retrieved from backend`);

      // Normalize the response structure
      const widgetData = data.widget || data.data || data;

      return NextResponse.json({
        success: true,
        widget: widgetData,
      });

    } catch (error) {
      console.error('Error fetching widget data:', error);

      // Return demo data on error
      const referer = request.headers.get('referer') || '';
      let widgetType = 'table';

      for (const type of Object.keys(WIDGET_ENDPOINTS)) {
        if (referer.includes(`/widgets/${type}`)) {
          widgetType = type;
          break;
        }
      }

      const demoData = getDemoDataForType(widgetType, id);

      return NextResponse.json({
        success: true,
        widget: demoData,
        source: 'demo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
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

    const validTypes = Object.keys(WIDGET_ENDPOINTS);
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

    // Store widget data in backend
    const endpoint = WIDGET_ENDPOINTS[type];
    if (endpoint) {
      try {
        const backendUrl = `${BACKEND_API_URL}${endpoint}`;
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...widgetData,
            widgetId,
            chartType
          })
        });

        if (response.ok) {
          const backendData = await response.json();
          console.log(`✅ Widget stored in backend with ID: ${backendData.widgetId || widgetId}`);
        }
      } catch (error) {
        console.error('Error storing widget in backend:', error);
      }
    }

    // Generate widget URL
    const widgetPath = `/widgets/${type}?id=${widgetId}`;
    const widgetUrl = `${baseURL}${widgetPath}`;

    // Return response for ChatGPT
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

// Helper function to generate demo data based on widget type
function getDemoDataForType(type: string, id: string): any {
  const demoData: Record<string, any> = {
    table: {
      type: 'table',
      title: 'Top 5 Productos Más Vendidos',
      headers: ['Producto', 'Categoría', 'Ventas (USD)', 'Unidades Vendidas'],
      rows: [
        ['iPhone 15', 'Electrónica', '1,200,000', '3,500'],
        ['Samsung Galaxy S24', 'Electrónica', '950,000', '3,000'],
        ['MacBook Air M3', 'Computadoras', '870,000', '1,200'],
        ['PlayStation 5', 'Consolas', '780,000', '2,300'],
        ['Apple Watch 9', 'Accesorios', '640,000', '2,800']
      ]
    },
    chart: {
      type: 'chart',
      title: 'Ventas Mensuales',
      chartType: 'bar',
      data: [45000, 52000, 48000, 61000, 58000, 72000],
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
    },
    dashboard: {
      type: 'dashboard',
      title: 'Dashboard de Ventas',
      metrics: [
        { value: '$1.2M', label: 'Ingresos', color: 'text-green-600', change: '+15%' },
        { value: '8,456', label: 'Clientes', color: 'text-blue-600', change: '+23%' },
        { value: '642', label: 'Pedidos', color: 'text-purple-600', change: '+18%' },
        { value: '97.8%', label: 'Satisfacción', color: 'text-orange-600', change: '+2%' }
      ]
    },
    timeline: {
      type: 'timeline',
      title: 'Hitos del Proyecto',
      events: [
        { date: '2025-01-01', title: 'Inicio', description: 'Lanzamiento del proyecto', color: 'blue' },
        { date: '2025-03-15', title: 'Fase Beta', description: 'Versión beta disponible', color: 'green' },
        { date: '2025-06-01', title: 'Lanzamiento', description: 'Versión final', color: 'purple' }
      ]
    },
    comparison: {
      type: 'comparison',
      title: 'Comparación de Planes',
      items: [
        { name: 'Básico', price: '$19/mes', features: ['5 usuarios', '10GB'], highlight: false },
        { name: 'Pro', price: '$49/mes', features: ['Usuarios ilimitados', '100GB', 'Soporte 24/7'], highlight: true },
        { name: 'Enterprise', price: '$199/mes', features: ['Todo incluido', 'SLA', 'Personalización'], highlight: false }
      ]
    }
  };

  return demoData[type] || demoData.table;
}