// Simple hooks stubs for widgets
export function useWidgetProps<T>(): T | null {
  return null;
}

export function useMaxHeight(): number | null {
  return null;
}

export function useDisplayMode(): string {
  return "full";
}

export function useIsChatGptApp(): boolean {
  // Detectar si estamos en el entorno de ChatGPT
  if (typeof window !== 'undefined') {
    // Verificar si window.openai existe
    return !!(window as any).openai;
  }
  return false;
}

/**
 * 🚨 CRITICAL EXPORT - NO MODIFICAR 🚨
 *
 * SIEMPRE exportar el hook SIMPLIFICADO que garantiza fallback data
 * NUNCA cambiar a 'use-widget-data' (sin -simple) - romperá los widgets
 *
 * El hook simplificado garantiza:
 * - Renderizado inmediato con fallback
 * - Sin pantallas de carga bloqueantes
 * - Nunca muestra "Sin datos disponibles"
 *
 * Ver CRITICAL_CONFIG.md antes de cualquier cambio
 */
export { useWidgetData } from './use-widget-data-simple';
