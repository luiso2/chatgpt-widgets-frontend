"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface UseWidgetDataOptions {
  fallbackData?: any;
}

/**
 * Hook simplificado para cargar datos del widget
 * Siempre muestra fallback data mientras intenta cargar datos reales
 */
export function useWidgetData<T = any>(options: UseWidgetDataOptions = {}) {
  const searchParams = useSearchParams();
  const widgetId = searchParams.get("id");

  // SIEMPRE iniciar con fallback data si existe
  const [data, setData] = useState<T | null>(options.fallbackData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("fallback");

  useEffect(() => {
    // Si no hay widgetId, usar solo fallback
    if (!widgetId) {
      console.log("📋 No hay widgetId, usando solo datos fallback");
      setDataSource("fallback");
      return;
    }

    // Intentar cargar datos reales del backend
    async function loadRealData() {
      try {
        console.log(`🔄 Intentando cargar datos reales para ID: ${widgetId}`);

        const response = await fetch(`/api/widgets?id=${widgetId}`);

        if (response.ok) {
          const apiData = await response.json();

          if (apiData.success && apiData.widget) {
            console.log("✅ Datos reales cargados:", apiData.widget);
            setData(apiData.widget);
            setDataSource(apiData.source || "api");
          } else {
            console.log("⚠️ API respondió pero sin datos válidos, manteniendo fallback");
          }
        } else {
          console.log(`⚠️ API respondió con error ${response.status}, manteniendo fallback`);
        }
      } catch (error) {
        console.log("⚠️ Error al cargar datos reales, manteniendo fallback:", error);
      }
    }

    // Cargar datos reales en background (sin afectar el renderizado)
    loadRealData();
  }, [widgetId]);

  return {
    data,
    loading,
    error,
    widgetId,
    isChatGptApp: typeof window !== 'undefined' && !!(window as any).openai,
    hasOpenAI: typeof window !== 'undefined' && !!(window as any).openai,
    dataSource
  };
}