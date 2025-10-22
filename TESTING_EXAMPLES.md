# Testing Examples

## Quick Test Commands

### 1. Test GET Endpoint (Get All Widgets)

```bash
curl https://frontend-production-d329.up.railway.app/api/widgets
```

**Expected Response:**
```json
{
  "success": true,
  "widgets": ["dashboard", "chart", "table", "timeline", "comparison"],
  "data": { ... }
}
```

### 2. Test GET Endpoint (Get Specific Widget)

```bash
curl "https://frontend-production-d329.up.railway.app/api/widgets?type=chart"
```

### 3. Test POST Endpoint (Create Chart Widget)

```bash
curl -X POST https://frontend-production-d329.up.railway.app/api/widgets \
  -H "Content-Type: application/json" \
  -d '{
    "type": "chart",
    "title": "Ventas Q4 2025",
    "chartType": "bar",
    "data": [15000, 22000, 18000, 28000],
    "labels": ["Oct", "Nov", "Dec", "Ene"]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "widget": {
    "type": "chart",
    "title": "Ventas Q4 2025",
    "chartType": "bar",
    "data": [15000, 22000, 18000, 28000],
    "labels": ["Oct", "Nov", "Dec", "Ene"]
  },
  "url": "https://frontend-production-d329.up.railway.app/widget/chart"
}
```

### 4. Test POST Endpoint (Create Dashboard Widget)

```bash
curl -X POST https://frontend-production-d329.up.railway.app/api/widgets \
  -H "Content-Type: application/json" \
  -d '{
    "type": "dashboard",
    "title": "Dashboard Octubre 2025",
    "metrics": [
      {
        "value": "$125,430",
        "label": "Ingresos Totales",
        "color": "text-green-600",
        "change": "+18%"
      },
      {
        "value": "1,234",
        "label": "Nuevos Clientes",
        "color": "text-blue-600",
        "change": "+25%"
      }
    ]
  }'
```

### 5. Test POST Endpoint (Create Table Widget)

```bash
curl -X POST https://frontend-production-d329.up.railway.app/api/widgets \
  -H "Content-Type: application/json" \
  -d '{
    "type": "table",
    "title": "Top 5 Productos",
    "headers": ["Producto", "Ventas", "Stock"],
    "rows": [
      ["iPhone 15", "$89,450", "125"],
      ["MacBook Air", "$145,320", "45"],
      ["AirPods Pro", "$34,890", "234"]
    ]
  }'
```

### 6. Test POST Endpoint (Create Timeline Widget)

```bash
curl -X POST https://frontend-production-d329.up.railway.app/api/widgets \
  -H "Content-Type: application/json" \
  -d '{
    "type": "timeline",
    "title": "Roadmap del Proyecto",
    "events": [
      {
        "date": "15 Enero 2025",
        "title": "Lanzamiento Beta",
        "description": "Primera versión beta disponible",
        "color": "blue"
      },
      {
        "date": "1 Marzo 2025",
        "title": "Versión 1.0",
        "description": "Lanzamiento oficial",
        "color": "green"
      }
    ]
  }'
```

### 7. Test POST Endpoint (Create Comparison Widget)

```bash
curl -X POST https://frontend-production-d329.up.railway.app/api/widgets \
  -H "Content-Type: application/json" \
  -d '{
    "type": "comparison",
    "title": "Comparación de Planes",
    "items": [
      {
        "name": "Plan Básico",
        "price": "$9/mes",
        "features": ["5 usuarios", "10GB", "Soporte email"],
        "highlight": false
      },
      {
        "name": "Plan Pro",
        "price": "$29/mes",
        "features": ["Usuarios ilimitados", "100GB", "Soporte 24/7", "API"],
        "highlight": true
      }
    ]
  }'
```

## Test Widget Display Pages

### Direct URLs to View Widgets

1. **Dashboard**: https://frontend-production-d329.up.railway.app/widget?type=dashboard
2. **Chart**: https://frontend-production-d329.up.railway.app/widget?type=chart
3. **Table**: https://frontend-production-d329.up.railway.app/widget?type=table
4. **Timeline**: https://frontend-production-d329.up.railway.app/widget?type=timeline
5. **Comparison**: https://frontend-production-d329.up.railway.app/widget?type=comparison

## Test OpenAPI Schema

```bash
curl https://frontend-production-d329.up.railway.app/openapi.json
```

## Error Testing

### Invalid Widget Type

```bash
curl -X POST https://frontend-production-d329.up.railway.app/api/widgets \
  -H "Content-Type: application/json" \
  -d '{"type": "invalid"}'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid widget type"
}
```

### Missing Type

```bash
curl -X POST https://frontend-production-d329.up.railway.app/api/widgets \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Widget type is required"
}
```

## Testing with ChatGPT

### Setup Instructions

1. Go to ChatGPT
2. Create a new Custom GPT
3. In "Actions", click "Import from URL"
4. Enter: `https://frontend-production-d329.up.railway.app/openapi.json`
5. Save the GPT

### Example Prompts to Test

1. "Muéstrame un gráfico de barras con las ventas de los últimos 4 meses: 15000, 22000, 18000, 28000"
2. "Crea un dashboard con estas métricas: Ingresos $125,430 (+18%), Usuarios 1,234 (+25%)"
3. "Genera una tabla con los top 3 productos vendidos"
4. "Muestra una línea de tiempo de nuestro proyecto"
5. "Compara estos dos planes: Básico $9/mes y Pro $29/mes"

### What ChatGPT Should Do

1. Call the POST /api/widgets endpoint
2. Receive the widget data and URL
3. Display the widget information to you
4. Provide you with the URL to view the interactive widget

## Using with JavaScript/TypeScript

```typescript
// Example: Create a chart widget
async function createChartWidget() {
  const response = await fetch('https://frontend-production-d329.up.railway.app/api/widgets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'chart',
      title: 'Monthly Sales',
      chartType: 'line',
      data: [15000, 22000, 18000, 28000, 32000],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    })
  });

  const result = await response.json();
  console.log('Widget created:', result);
  console.log('View at:', result.url);

  return result;
}
```

## Troubleshooting

### Issue: CORS errors
**Solution**: The API has CORS enabled, but if you're testing from a different domain, check browser console.

### Issue: Widget not displaying
**Solution**: Check the URL parameters. Type must be one of: dashboard, chart, table, timeline, comparison

### Issue: Invalid data format
**Solution**: Check the OpenAPI schema for required fields for each widget type.

## Health Check

```bash
# Check if the service is running
curl https://frontend-production-d329.up.railway.app/
```

Should return the homepage with status 200.
