"use client";

import { useWidgetData, useMaxHeight, useDisplayMode } from "@/app/hooks";
import Timeline from "@/components/widgets/Timeline";

export const dynamic = 'force-dynamic';

interface TimelineData {
  title: string;
  events: Array<{
    date: string;
    title: string;
    description: string;
    color: string;
  }>;
}

export default function TimelineWidget() {
  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();

  // Datos de ejemplo para modo desarrollo
  const fallbackData: TimelineData = {
    title: "Línea de Tiempo del Proyecto",
    events: [
      {
        date: "1 Enero 2025",
        title: "Inicio del Proyecto",
        description: "Kick-off del proyecto con el equipo completo y definición de objetivos.",
        color: "blue"
      },
      {
        date: "15 Febrero 2025",
        title: "Fase de Diseño",
        description: "Completado el diseño de la arquitectura y mockups de la interfaz.",
        color: "green"
      },
      {
        date: "30 Marzo 2025",
        title: "MVP Lanzado",
        description: "Versión mínima viable lanzada con funcionalidades básicas.",
        color: "purple"
      },
      {
        date: "15 Mayo 2025",
        title: "Primera Actualización",
        description: "Implementación de nuevas características basadas en feedback de usuarios.",
        color: "orange"
      },
      {
        date: "1 Julio 2025",
        title: "Lanzamiento Oficial",
        description: "Versión 1.0 completa lanzada al público general.",
        color: "red"
      }
    ]
  };

  // Usar el hook unificado para cargar datos
  // IMPORTANTE: Siempre usar fallbackData para garantizar que algo se muestre
  const { data, loading, error, hasOpenAI, dataSource } = useWidgetData<TimelineData>({
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
          <p className="text-gray-600">Cargando línea de tiempo...</p>
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
  if (!data || !data.title || !data.events) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center"
        style={{ maxHeight, height: displayMode === "fullscreen" ? maxHeight : undefined }}
      >
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4">🕐</div>
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

  // Renderizar la línea de tiempo con los datos cargados
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6"
      style={{ maxHeight, height: displayMode === "fullscreen" ? maxHeight : undefined }}
    >
      <Timeline title={data.title} events={data.events} />

      {/* Indicador de fuente de datos (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs">
          Datos: {dataSource} {hasOpenAI && '| OpenAI ✓'}
        </div>
      )}
    </div>
  );
}