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

// Export the new widget data hook
export { useWidgetData } from './use-widget-data';
