# API Usage Guide

## 🚀 Frontend está conectado con Backend

El frontend actúa como **proxy** al backend de Railway. Cuando llamas a la API del frontend, este automáticamente redirige la petición al backend y retorna el resultado formateado.

**Backend URL**: https://gpt-widget-production.up.railway.app
**Frontend URL**: https://frontend-production-d329.up.railway.app

## 📊 Formato de Respuesta

Todas las respuestas incluyen:
- `success`: boolean
- `markdown`: string (contenido formateado para mostrar en chat)
- `type`: "markdown"
- `widget`: objeto con los datos enviados
- `message`: mensaje de éxito

## 🎯 Endpoints y Formatos

### 1. Dashboard

**Endpoint**: `POST /api/widgets`

```json
{
  "type": "dashboard",
  "title": "Dashboard Q4 2025",
  "metrics": [
    {
      "value": "$125,430",
      "label": "Ingresos Totales",
      "color": "green",
      "change": "+18%"
    },
    {
      "value": "12,430",
      "label": "Usuarios Activos",
      "color": "blue",
      "change": "+25%"
    }
  ]
}
```

**Respuesta**:
```
# 📊 Dashboard Q4 2025

⚪ **Ingresos Totales**: $125,430 (+18%) 📈
⚪ **Usuarios Activos**: 12,430 (+25%) 📈
```

### 2. Chart (Gráficos)

**Endpoint**: `POST /api/widgets`

**IMPORTANTE**: Para charts, usa el campo `type` para especificar TANTO el tipo de widget como el tipo de gráfico:
- Primer `type`: "chart" (tipo de widget)
- Segundo campo dentro del body que el backend usa: `type` también (tipo de gráfico)

```json
{
  "type": "chart",
  "title": "Ventas Mensuales 2025",
  "data": [15000, 22000, 18000, 28000],
  "labels": ["Oct", "Nov", "Dic", "Ene"]
}
```

**NOTA**: El campo `type` para el tipo de gráfico (bar, line, pie, etc.) debe enviarse en la llamada directa al backend:
- Para usar desde GPT, simplemente envía el JSON anterior y el backend usará el tipo por defecto
- Para especificar el tipo de gráfico, llama directamente al backend:

```bash
curl -X POST https://gpt-widget-production.up.railway.app/api/widget/chart \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ventas 2025",
    "type": "bar",
    "data": [15000, 22000, 18000, 28000],
    "labels": ["Oct", "Nov", "Dic", "Ene"]
  }'
```

**Tipos de gráficos disponibles**:
- `bar` - Gráfico de barras
- `line` - Gráfico de líneas
- `pie` - Gráfico circular
- `doughnut` - Gráfico de dona
- `radar` - Gráfico de radar

**Respuesta**:
```
# 📊 Ventas Mensuales 2025

```
Oct        │ ███████ 15000
Nov        │ ██████████████ 22000
Dic        │ ████████████ 18000
Ene        │ ████████████████████ 28000
```

**Total**: 83000
**Promedio**: 20750.00
**Máximo**: 28000 (Ene)
```

### 3. Table (Tablas)

**Endpoint**: `POST /api/widgets`

```json
{
  "type": "table",
  "title": "Top 5 Productos",
  "headers": ["Producto", "Categoría", "Ventas", "Stock", "Estado"],
  "rows": [
    ["iPhone 15 Pro", "Tecnología", "$89,450", "125", "Activo"],
    ["MacBook Air M3", "Computadoras", "$145,320", "45", "Activo"],
    ["AirPods Pro 2", "Audio", "$34,890", "234", "Activo"]
  ]
}
```

**Respuesta**:
```
# 📋 Top 5 Productos

| Producto | Categoría | Ventas | Stock | Estado |
|---|---|---|---|---|
| iPhone 15 Pro | Tecnología | $89,450 | 125 | Activo |
| MacBook Air M3 | Computadoras | $145,320 | 45 | Activo |
| AirPods Pro 2 | Audio | $34,890 | 234 | Activo |

**Total de registros**: 3
```

### 4. Timeline (Línea de Tiempo)

**Endpoint**: `POST /api/widgets`

```json
{
  "type": "timeline",
  "title": "Historia del Proyecto",
  "events": [
    {
      "date": "15 Enero 2025",
      "title": "Lanzamiento Beta",
      "description": "Primera versión beta lanzada al público con funcionalidades básicas.",
      "color": "blue"
    },
    {
      "date": "1 Marzo 2025",
      "title": "Versión 1.0",
      "description": "Lanzamiento oficial con todas las características principales.",
      "color": "green"
    }
  ]
}
```

**Colores disponibles**: blue, green, purple, orange, red

**Respuesta**:
```
# 📅 Historia del Proyecto

🔵 **15 Enero 2025** - Lanzamiento Beta
   Primera versión beta lanzada al público con funcionalidades básicas.

🟢 **1 Marzo 2025** - Versión 1.0
   Lanzamiento oficial con todas las características principales.
```

### 5. Comparison (Comparación)

**Endpoint**: `POST /api/widgets`

```json
{
  "type": "comparison",
  "title": "Planes de Suscripción",
  "items": [
    {
      "name": "Plan Básico",
      "price": "$9/mes",
      "features": [
        "5 usuarios",
        "10GB almacenamiento",
        "Soporte por email",
        "Dashboard básico"
      ]
    },
    {
      "name": "Plan Pro",
      "price": "$29/mes",
      "features": [
        "Usuarios ilimitados",
        "100GB almacenamiento",
        "Soporte prioritario 24/7",
        "Dashboard avanzado",
        "API Access",
        "Integraciones"
      ],
      "recommended": true
    }
  ]
}
```

**Respuesta**:
```
# ⚖️ Planes de Suscripción

### Plan Básico
**Precio**: $9/mes

**Características**:
✓ 5 usuarios
✓ 10GB almacenamiento
✓ Soporte por email
✓ Dashboard básico

### Plan Pro ⭐ RECOMENDADO
**Precio**: $29/mes

**Características**:
✓ Usuarios ilimitados
✓ 100GB almacenamiento
✓ Soporte prioritario 24/7
✓ Dashboard avanzado
✓ API Access
✓ Integraciones
```

## 🔧 Ejemplos de Uso

### Con curl

```bash
# Dashboard
curl -X POST https://frontend-production-d329.up.railway.app/api/widgets \
  -H "Content-Type: application/json" \
  -d '{
    "type": "dashboard",
    "title": "Métricas Octubre 2025",
    "metrics": [
      {"value": "$125,430", "label": "Ingresos", "color": "green", "change": "+18%"}
    ]
  }'

# Table
curl -X POST https://frontend-production-d329.up.railway.app/api/widgets \
  -H "Content-Type: application/json" \
  -d '{
    "type": "table",
    "title": "Top Productos",
    "headers": ["Producto", "Ventas"],
    "rows": [["iPhone", "$89,450"], ["MacBook", "$145,320"]]
  }'
```

### Con JavaScript/TypeScript

```typescript
async function createWidget(type: string, data: any) {
  const response = await fetch('https://frontend-production-d329.up.railway.app/api/widgets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...data })
  });

  const result = await response.json();

  if (result.success) {
    console.log('Markdown output:');
    console.log(result.markdown);
  }

  return result;
}

// Uso
await createWidget('dashboard', {
  title: 'Ventas Hoy',
  metrics: [
    { value: '$1,234', label: 'Ventas', color: 'green', change: '+5%' }
  ]
});
```

## 🤖 Uso con ChatGPT

Cuando configures GPT Actions:

1. Importa el schema: `https://frontend-production-d329.up.railway.app/openapi.json`
2. ChatGPT llamará automáticamente a `POST /api/widgets`
3. El frontend redirige al backend
4. El backend genera el markdown
5. ChatGPT muestra el widget formateado inline en el chat

**El usuario NO necesita abrir URLs externas** - todo se muestra directamente en el chat.

## ⚠️ Notas Importantes

1. **Sin URLs externas**: El sistema retorna markdown que se muestra directamente en el chat
2. **Backend integrado**: El frontend actúa como proxy transparente al backend
3. **Formato consistente**: Todas las respuestas incluyen el campo `markdown` con el contenido formateado
4. **Errores claros**: Si el backend no está disponible, recibirás un mensaje de error descriptivo

## 🔗 Enlaces

- Frontend: https://frontend-production-d329.up.railway.app
- Backend: https://gpt-widget-production.up.railway.app
- OpenAPI Schema: https://frontend-production-d329.up.railway.app/openapi.json
- Backend OpenAPI: https://gpt-widget-production.up.railway.app/openapi.json
