"use client";

import { useWidgetData, useMaxHeight, useDisplayMode } from "@/app/hooks";
import Comparison from "@/components/widgets/Comparison";

export const dynamic = 'force-dynamic';

interface ComparisonData {
  title: string;
  items: Array<{
    name: string;
    price: string;
    features: string[];
    highlight: boolean;
  }>;
}

export default function ComparisonWidget() {
  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();

  // Datos de ejemplo para modo desarrollo
  const fallbackData: ComparisonData = {
    title: "Comparación de Planes",
    items: [
      {
        name: "Plan Starter",
        price: "$19/mes",
        features: [
          "3 usuarios",
          "5GB almacenamiento",
          "Soporte por email",
          "Dashboard básico"
        ],
        highlight: false
      },
      {
        name: "Plan Professional",
        price: "$49/mes",
        features: [
          "Usuarios ilimitados",
          "50GB almacenamiento",
          "Soporte prioritario",
          "Dashboard avanzado",
          "API completa",
          "Integraciones premium"
        ],
        highlight: true
      },
      {
        name: "Plan Enterprise",
        price: "$199/mes",
        features: [
          "Todo de Professional",
          "Almacenamiento ilimitado",
          "Soporte dedicado 24/7",
          "Personalización completa",
          "SLA garantizado",
          "Instalación on-premise"
        ],
        highlight: false
      }
    ]
  };

  // Usar el hook unificado para cargar datos
  // IMPORTANTE: Siempre usar fallbackData para garantizar que algo se muestre
  const { data, loading, error, hasOpenAI, dataSource } = useWidgetData<ComparisonData>({
    fallbackData: fallbackData // Siempre usar fallback data
  });

  // Estado de carga
  if (loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center"
        style={{ maxHeight, height: displayMode === "fullscreen" ? maxHeight : undefined }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando comparación...</p>
          {dataSource && (
            <p className="text-xs text-gray-400 mt-2">Fuente: {dataSource}</p>
          )}
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center"
        style={{ maxHeight, height: displayMode === "fullscreen" ? maxHeight : undefined }}
      >
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="text-left bg-gray-100 rounded-lg p-4 text-sm text-gray-500">
            <p className="font-semibold mb-2">Información de depuración:</p>
            <ul className="space-y-1">
              <li>• window.openai: {hasOpenAI ? '✅ Disponible' : '❌ No disponible'}</li>
              <li>• Fuente de datos: {dataSource || 'Ninguna'}</li>
              <li>• Modo: {process.env.NODE_ENV}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Sin datos
  if (!data || !data.title || !data.items) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center"
        style={{ maxHeight, height: displayMode === "fullscreen" ? maxHeight : undefined }}
      >
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4">⚖️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sin datos disponibles</h2>
          <p className="text-gray-600">
            {hasOpenAI
              ? "Esperando datos de ChatGPT..."
              : "Este widget requiere datos para visualizar."}
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
            <p className="text-sm font-semibold text-blue-800 mb-2">Métodos de carga soportados:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• ChatGPT con window.openai.getData()</li>
              <li>• API REST con parámetro ?id=widgetId</li>
              <li>• MCP inline rendering</li>
              {process.env.NODE_ENV === 'development' && (
                <li>• Datos de ejemplo en modo desarrollo</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar la comparación con los datos cargados
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6"
      style={{ maxHeight, height: displayMode === "fullscreen" ? maxHeight : undefined }}
    >
      <Comparison title={data.title} items={data.items} />

      {/* Indicador de fuente de datos (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs">
          Datos: {dataSource} {hasOpenAI && '| OpenAI ✓'}
        </div>
      )}
    </div>
  );
}