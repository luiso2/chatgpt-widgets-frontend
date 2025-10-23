# 🗺️ Rutas Disponibles - Widget System

## 📊 Frontend URLs (14 widgets completos)

Todas las rutas siguen el patrón: `/widgets/{tipo}?id={widgetId}`

### Widget Pages:

| # | Tipo | Ruta | Componente |
|---|------|------|-----------|
| 1 | Dashboard | `/widgets/dashboard?id=xxx` | Dashboard.tsx |
| 2 | Chart | `/widgets/chart?id=xxx` | Chart.tsx |
| 3 | Table | `/widgets/table?id=xxx` | Table.tsx |
| 4 | Timeline | `/widgets/timeline?id=xxx` | Timeline.tsx |
| 5 | Comparison | `/widgets/comparison?id=xxx` | Comparison.tsx |
| 6 | Tree | `/widgets/tree?id=xxx` | Tree.tsx |
| 7 | Stats | `/widgets/stats?id=xxx` | StatsCards.tsx |
| 8 | Progress | `/widgets/progress?id=xxx` | Progress.tsx |
| 9 | Kanban | `/widgets/kanban?id=xxx` | Kanban.tsx |
| 10 | Calendar | `/widgets/calendar?id=xxx` | CalendarEvents.tsx |
| 11 | Pricing | `/widgets/pricing?id=xxx` | PricingCards.tsx |
| 12 | Gallery | `/widgets/gallery?id=xxx` | Gallery.tsx |
| 13 | Notifications | `/widgets/notifications?id=xxx` | Notifications.tsx |
| 14 | Activity | `/widgets/activity?id=xxx` | ActivityFeed.tsx |

---

## 🔌 Backend API Endpoints

Base URL: `https://gpt-widget-production.up.railway.app`

### POST Endpoints (retornan markdown):

| # | Endpoint | Descripción |
|---|----------|-------------|
| 1 | `POST /api/widget/dashboard` | Panel de métricas KPI |
| 2 | `POST /api/widget/chart` | Gráficos (bar, line, pie, doughnut) |
| 3 | `POST /api/widget/table` | Tablas de datos |
| 4 | `POST /api/widget/timeline` | Líneas de tiempo |
| 5 | `POST /api/widget/comparison` | Comparaciones |
| 6 | `POST /api/widget/tree` | Estructuras jerárquicas |
| 7 | `POST /api/widget/stats` | Tarjetas de estadísticas |
| 8 | `POST /api/widget/progress` | Barras de progreso |
| 9 | `POST /api/widget/kanban` | Tableros Kanban |
| 10 | `POST /api/widget/calendar` | Eventos de calendario |
| 11 | `POST /api/widget/pricing` | Tarjetas de precios |
| 12 | `POST /api/widget/gallery` | Galerías de imágenes |
| 13 | `POST /api/widget/notifications` | Sistema de notificaciones |
| 14 | `POST /api/widget/activity` | Feed de actividades |

### Otros Endpoints:

```
GET  /                  - Información del API
GET  /health            - Health check
GET  /openapi.json      - OpenAPI schema para GPT
```

---

## 🌐 Frontend API Routes

Base: `/api/widgets`

### Endpoints:

```typescript
// GET - Obtener widget por ID o listar tipos
GET /api/widgets?id=xxx
GET /api/widgets

// POST - Crear widget y obtener URL
POST /api/widgets
{
  "type": "dashboard",
  "title": "Mi Dashboard",
  "metrics": [...]
}

// Response:
{
  "widgetUrl": "https://frontend.com/widgets/dashboard?id=xxx",
  "title": "Mi Dashboard",
  "description": "..."
}
```

---

## 📁 Estructura de Archivos

```
chatgpt-widgets-frontend/
├── app/
│   ├── api/
│   │   └── widgets/
│   │       └── route.ts           ← Frontend API
│   ├── widgets/
│   │   ├── dashboard/page.tsx     ✅
│   │   ├── chart/page.tsx         ✅
│   │   ├── table/page.tsx         ✅
│   │   ├── timeline/page.tsx      ✅
│   │   ├── comparison/page.tsx    ✅
│   │   ├── tree/page.tsx          ✅
│   │   ├── stats/page.tsx         ✅ NUEVO
│   │   ├── progress/page.tsx      ✅ NUEVO
│   │   ├── kanban/page.tsx        ✅ NUEVO
│   │   ├── calendar/page.tsx      ✅ NUEVO
│   │   ├── pricing/page.tsx       ✅ NUEVO
│   │   ├── gallery/page.tsx       ✅ NUEVO
│   │   ├── notifications/page.tsx ✅ NUEVO
│   │   └── activity/page.tsx      ✅ NUEVO
│   └── hooks/
│       └── index.ts               ← 25+ custom hooks
├── components/
│   └── widgets/
│       ├── Dashboard.tsx          ✅
│       ├── Chart.tsx              ✅
│       ├── Table.tsx              ✅
│       ├── Timeline.tsx           ✅
│       ├── Comparison.tsx         ✅
│       ├── Tree.tsx               ✅
│       ├── StatsCards.tsx         ✅ NUEVO
│       ├── Progress.tsx           ✅ NUEVO
│       ├── Kanban.tsx             ✅ NUEVO
│       ├── CalendarEvents.tsx     ✅ NUEVO
│       ├── PricingCards.tsx       ✅ NUEVO
│       ├── Gallery.tsx            ✅ NUEVO
│       ├── Notifications.tsx      ✅ NUEVO
│       └── ActivityFeed.tsx       ✅ NUEVO
└── baseUrl.ts                     ← Frontend URL config
```

---

## 🔄 Flujo de Datos

### Opción 1: ChatGPT GPT → Backend → Markdown
```
ChatGPT GPT
    ↓
POST https://gpt-widget-production.up.railway.app/api/widget/dashboard
    ↓
Backend retorna: { content: "# 📊 Dashboard...", type: "markdown" }
    ↓
ChatGPT muestra el markdown directamente
```

### Opción 2: ChatGPT GPT → Frontend → Visual Widget
```
ChatGPT GPT
    ↓
POST https://frontend.com/api/widgets
{
  "type": "dashboard",
  "title": "Mi Dashboard",
  "metrics": [...]
}
    ↓
Frontend retorna: { widgetUrl: "https://frontend.com/widgets/dashboard?id=xxx" }
    ↓
ChatGPT muestra el URL (o puede hacer iframe embed)
```

### Opción 3: MCP → Frontend → Widget Inline
```
Claude Desktop MCP
    ↓
Envía datos via window.openai
    ↓
Frontend detecta MCP data y renderiza widget directamente
```

---

## 🧪 Testing URLs

### Dashboard:
```
https://frontend.com/widgets/dashboard?id=test-123
```

### Chart:
```
https://frontend.com/widgets/chart?id=test-456
```

### Table:
```
https://frontend.com/widgets/table?id=test-789
```

### Stats:
```
https://frontend.com/widgets/stats?id=test-abc
```

### Kanban:
```
https://frontend.com/widgets/kanban?id=test-def
```

### Progress:
```
https://frontend.com/widgets/progress?id=test-ghi
```

---

## 📊 Widget Type Mapping

El mapping entre tipos se maneja en `/app/api/widgets/route.ts`:

```typescript
const WIDGET_ENDPOINTS: Record<string, string> = {
  dashboard: "/api/widget/dashboard",
  chart: "/api/widget/chart",
  table: "/api/widget/table",
  timeline: "/api/widget/timeline",
  comparison: "/api/widget/comparison",
  tree: "/api/widget/tree",
  stats: "/api/widget/stats",
  progress: "/api/widget/progress",
  kanban: "/api/widget/kanban",
  calendar: "/api/widget/calendar",
  pricing: "/api/widget/pricing",
  gallery: "/api/widget/gallery",
  notifications: "/api/widget/notifications",
  activity: "/api/widget/activity",
};
```

---

## 🎯 Uso Correcto

### ✅ CORRECTO:
```
/widgets/table?id=abc123           ← plural "widgets"
/widgets/dashboard?id=xyz456
/widgets/stats?id=def789
```

### ❌ INCORRECTO:
```
/widget/table/abc123               ← singular "widget" + path param
/widget/table?id=abc123            ← singular "widget"
/widgets/table/abc123              ← sin query param
```

---

## 🚀 Deployment

### Frontend:
- **Platform**: Vercel / Netlify
- **Build command**: `npm run build`
- **Output**: `.next/`
- **Framework**: Next.js 16

### Backend:
- **Platform**: Railway
- **URL**: `https://gpt-widget-production.up.railway.app`
- **Health**: `https://gpt-widget-production.up.railway.app/health`
- **OpenAPI**: `https://gpt-widget-production.up.railway.app/openapi.json`

---

## 📚 Documentación Adicional

- `HOOKS.md` - Documentación de 25+ hooks personalizados
- `WIDGETS_NUEVOS.md` - Detalles de los 8 widgets nuevos
- `GPT_INSTRUCTIONS_V2_COMPLETE.md` - Instrucciones completas para GPT
- `SETUP_GPT_RAPIDO.md` - Guía de configuración rápida

---

**Total de Widgets**: 14 tipos profesionales ✅
**Total de Hooks**: 25+ custom hooks ✅
**Total de Rutas Frontend**: 14 páginas ✅
**Total de Endpoints Backend**: 14 + 3 auxiliares ✅

Última actualización: Octubre 2025
