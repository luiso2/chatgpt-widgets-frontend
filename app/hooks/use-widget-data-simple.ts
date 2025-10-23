"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface UseWidgetDataOptions {
  fallbackData?: any;
}

/**
 * 🚨 CRITICAL HOOK - NO MODIFICAR SIN LEER CRITICAL_CONFIG.md 🚨
 *
 * Hook simplificado para cargar datos del widget
 * Siempre muestra fallback data mientras intenta cargar datos reales
 *
 * REGLAS CRÍTICAS:
 * 1. SIEMPRE inicializar con fallbackData (NUNCA null si hay fallback)
 * 2. NUNCA inicializar loading en true (bloquearía el renderizado)
 * 3. SIEMPRE mantener fallback si no hay datos reales
 * 4. NO cambiar el orden de carga (fallback primero, API después)
 *
 * @param options.fallbackData - Datos de respaldo OBLIGATORIOS para evitar pantallas vacías
 */
export function useWidgetData<T = any>(options: UseWidgetDataOptions = {}) {
  const searchParams = useSearchParams();
  const widgetId = searchParams.get("id");

  // ⚠️ WARNING: SIEMPRE iniciar con fallback data si existe
  // NUNCA cambiar esto a null o undefined - romperá los widgets
  const [data, setData] = useState<T | null>(options.fallbackData || null);

  // ⚠️ WARNING: NUNCA inicializar loading en true
  // Esto causaría pantallas de carga bloqueantes
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