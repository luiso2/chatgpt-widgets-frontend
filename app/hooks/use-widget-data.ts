"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useWidgetProps } from "./use-widget-props";
import { useIsChatGptApp } from "./use-is-chatgpt-app";

interface UseWidgetDataOptions {
  fallbackData?: any;
}

/**
 * Hook para cargar datos del widget con fallback inteligente
 *
 * Prioridad de carga:
 * 1. Si window.openai existe (modo ChatGPT embebido), intenta obtener datos via window.openai.getData()
 * 2. Si no hay window.openai pero hay widgetId, hace fetch al API REST
 * 3. Si hay datos MCP disponibles (useWidgetProps), los usa
 * 4. Fallback a datos por defecto si se proporcionan
 */
export function useWidgetData<T = any>(options: UseWidgetDataOptions = {}) {
  const searchParams = useSearchParams();
  const widgetId = searchParams.get("id");

  // Inicializar con fallback data si está disponible para evitar pantalla de carga
  const [data, setData] = useState<T | null>(options.fallbackData || null);
  const [loading, setLoading] = useState(!options.fallbackData); // No loading si hay fallback
  const [error, setError] = useState<string | null>(null);

  const isChatGptApp = useIsChatGptApp();

  // Intenta obtener datos de MCP/OpenAI hooks existentes
  const toolOutput = useWidgetProps<{
    result?: { structuredContent?: T };
  }>();

  useEffect(() => {
    // Si no hay widgetId, no intentar cargar
    if (!widgetId) {
      setLoading(false);
      return;
    }

    async function loadData() {
      // No marcar como loading si ya tenemos datos de fallback
      if (!options.fallbackData) {
        setLoading(true);
      }
      setError(null);

      try {
        console.log("🌐 Cargando datos via API REST con ID:", widgetId);
        const response = await fetch(`/api/widgets?id=${widgetId}`);

        if (response.ok) {
          const apiData = await response.json();

          if (apiData.success && apiData.widget) {
            console.log("✅ Datos cargados exitosamente desde API");
            console.log("📦 Datos recibidos:", apiData.widget);
            setData(apiData.widget);
            setLoading(false);
            return;
          } else {
            console.warn("⚠️ Respuesta sin widget data:", apiData);
          }
        } else {
          console.warn(`⚠️ API response not OK: ${response.status}`);
        }
      } catch (apiError) {
        console.warn("⚠️ Error cargando datos de API:", apiError);
      }

        // Caso 2: Intentar con window.openai si está disponible
        // (poco probable en iframe, pero lo intentamos)
        if (typeof window !== 'undefined' && (window as any).openai && widgetId) {
          console.log("🔍 Intentando con window.openai...");
          try {
            const openaiData = await (window as any).openai.getData(widgetId);
            if (openaiData) {
              setData(openaiData);
              setLoading(false);
              return;
            }
          } catch (openaiError) {
            console.warn("⚠️ window.openai no disponible o error:", openaiError);
          }
        }

        // Caso 3: Datos de MCP disponibles (inline rendering)
        if (toolOutput?.result?.structuredContent) {
          console.log("📦 Usando datos MCP inline");
          setData(toolOutput.result.structuredContent);
          setLoading(false);
          return;
        }

      // Si llegamos aquí y no hay datos pero sí fallback, mantener el fallback
      if (!data && options.fallbackData) {
        console.log("📋 Manteniendo datos fallback");
        setData(options.fallbackData);
      }

      setLoading(false);

      } catch (err) {
        console.error("❌ Error cargando datos del widget:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        setLoading(false);
      }
    }

    loadData();
  }, [widgetId, toolOutput?.result?.structuredContent]);

  return {
    data,
    loading,
    error,
    widgetId,
    isChatGptApp,
    hasOpenAI: typeof window !== 'undefined' && !!(window as any).openai,
    dataSource: data ? (
      toolOutput?.result?.structuredContent ? 'mcp' :
      (window as any).openai ? 'openai' :
      widgetId ? 'api' :
      'fallback'
    ) : null
  };
}