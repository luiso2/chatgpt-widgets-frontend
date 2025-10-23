# 🔄 Sistema de Fallback API para Widgets

## Descripción General

Se ha implementado un sistema de fallback inteligente para la carga de datos en todos los widgets. Este sistema garantiza que los widgets funcionen tanto en modo ChatGPT embebido como en modo standalone/preview.

## 📋 Características Implementadas

### 1. **Hook Unificado: `useWidgetData`**

Se creó un hook personalizado que maneja automáticamente múltiples fuentes de datos con la siguiente prioridad:

1. **window.openai.getData()** - Modo ChatGPT embebido
2. **MCP inline rendering** - Datos de Model Context Protocol
3. **API REST fallback** - Backend API con parámetro `?id=widgetId`
4. **Datos de desarrollo** - Datos de ejemplo en modo desarrollo

### 2. **Widgets Actualizados**

Todos los widgets principales han sido actualizados para usar el nuevo sistema:

- ✅ **Chart** (`/app/widgets/chart/page.tsx`)
- ✅ **Dashboard** (`/app/widgets/dashboard/page.tsx`)
- ✅ **Table** (`/app/widgets/table/page.tsx`)
- ✅ **Timeline** (`/app/widgets/timeline/page.tsx`)
- ✅ **Comparison** (`/app/widgets/comparison/page.tsx`)

## 🚀 Cómo Funciona

### Flujo de Carga de Datos

```javascript
// Ejemplo de uso en un widget
const { data, loading, error, hasOpenAI, dataSource } = useWidgetData<WidgetData>({
  fallbackData: process.env.NODE_ENV === 'development' ? exampleData : undefined
});
```

### Detección Automática del Entorno

El sistema detecta automáticamente el entorno de ejecución:

```javascript
// Detecta si window.openai está disponible
if (window.openai && widgetId) {
  // Modo ChatGPT - usa window.openai.getData()
  const data = await window.openai.getData(widgetId);
}

// Si no hay window.openai, usa API REST
else if (widgetId) {
  // Modo standalone - usa fallback API
  const response = await fetch(`/api/widgets?id=${widgetId}`);
  const data = await response.json();
}
```

## 🎯 Estados del Widget

### 1. **Estado de Carga**
```jsx
<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
<p>Cargando widget...</p>
<p>Fuente: {dataSource}</p>
```

### 2. **Estado de Error**
Muestra información detallada de depuración:
- Estado de window.openai
- Fuente de datos intentada
- Mensaje de error específico

### 3. **Estado Sin Datos**
Explica los métodos de carga soportados:
- ChatGPT con window.openai.getData()
- API REST con parámetro ?id=widgetId
- MCP inline rendering
- Datos de ejemplo en desarrollo

### 4. **Estado con Datos**
Renderiza el widget con indicador de fuente (solo en desarrollo)

## 🧪 Pruebas

### Archivo de Prueba: `test-widget-fallback.html`

Se incluye un archivo HTML para probar el sistema:

1. **Simular window.openai**: Toggle para activar/desactivar el modo ChatGPT
2. **Probar cada widget**: Botones para crear y visualizar cada tipo de widget
3. **Vista previa**: Iframe que muestra el widget renderizado

### Cómo Probar

```bash
# 1. Iniciar el servidor de desarrollo
npm run dev

# 2. Abrir el archivo de prueba en un navegador
open test-widget-fallback.html

# 3. Probar con y sin window.openai habilitado
```

## 🔧 Configuración

### Variables de Entorno

```env
# API Backend URL
NEXT_PUBLIC_API_URL=https://gpt-widget-production.up.railway.app

# Base URL del Frontend
NEXT_PUBLIC_BASE_URL=https://your-frontend-app.up.railway.app
```

### Estructura de Datos

Cada widget espera una estructura de datos específica:

#### Chart
```typescript
interface ChartData {
  title: string;
  chartType?: "bar" | "line" | "pie" | "doughnut";
  data: number[];
  labels: string[];
}
```

#### Dashboard
```typescript
interface DashboardData {
  title: string;
  metrics: Array<{
    value: string;
    label: string;
    color: string;
    change?: string;
  }>;
}
```

#### Table
```typescript
interface TableData {
  title: string;
  headers: string[];
  rows: string[][];
}
```

#### Timeline
```typescript
interface TimelineData {
  title: string;
  events: Array<{
    date: string;
    title: string;
    description: string;
    color: string;
  }>;
}
```

#### Comparison
```typescript
interface ComparisonData {
  title: string;
  items: Array<{
    name: string;
    price: string;
    features: string[];
    highlight: boolean;
  }>;
}
```

## 📊 Beneficios del Sistema

1. **Flexibilidad**: Funciona en múltiples entornos sin cambios de código
2. **Transparencia**: Muestra claramente la fuente de datos
3. **Depuración Fácil**: Información detallada de errores
4. **Desarrollo Ágil**: Datos de ejemplo automáticos en desarrollo
5. **Compatibilidad**: Mantiene compatibilidad con ChatGPT y standalone

## 🔮 Uso Futuro

Para agregar un nuevo widget con fallback:

```typescript
// 1. Importar el hook
import { useWidgetData } from "@/app/hooks";

// 2. Definir la interfaz de datos
interface MyWidgetData {
  title: string;
  // ... otros campos
}

// 3. Usar el hook en el componente
export default function MyWidget() {
  const { data, loading, error } = useWidgetData<MyWidgetData>({
    fallbackData: devData // opcional
  });

  // 4. Manejar estados
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data) return <NoDataState />;

  // 5. Renderizar widget
  return <MyWidgetComponent data={data} />;
}
```

## 🐛 Troubleshooting

### El widget no carga datos

1. Verificar que el widgetId existe en la URL
2. Comprobar que el backend API está funcionando
3. Ver la consola del navegador para errores
4. Verificar CORS si hay problemas de cross-origin

### window.openai no funciona

1. Asegurarse de que el widget está en un iframe de ChatGPT
2. Verificar que window.openai.getData está disponible
3. Comprobar que el widgetId es válido

### Datos de desarrollo no aparecen

1. Verificar que NODE_ENV === 'development'
2. Asegurarse de que fallbackData está definido
3. Comprobar la estructura de datos

---

## 📝 Notas

- El sistema está diseñado para ser transparente y fácil de depurar
- Los indicadores de fuente solo aparecen en modo desarrollo
- El fallback es automático y no requiere intervención manual
- Todos los widgets mantienen una experiencia consistente

## 🚀 Próximos Pasos

1. Implementar caché local para mejorar rendimiento
2. Agregar reintentos automáticos en caso de fallo
3. Implementar WebSocket para actualizaciones en tiempo real
4. Agregar métricas de uso y analytics