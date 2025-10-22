# ChatGPT MCP Setup Guide

## 🎯 Overview

Este proyecto ahora usa **Model Context Protocol (MCP)** para mostrar widgets **visualmente en iframes** dentro del chat de ChatGPT, no solo como markdown.

## 🚀 ¿Cómo Funciona?

1. **ChatGPT llama a un Tool** (ej: `create_dashboard`)
2. **El Tool referencia un Resource** via `templateUri`
3. **ChatGPT obtiene el HTML** del Resource
4. **Widget se renderiza en iframe** dentro del chat
5. **SDK Bootstrap** parchea APIs para funcionamiento correcto

## 📡 MCP Server URL

```
https://frontend-production-d329.up.railway.app/mcp
```

## 🔧 Configuración en ChatGPT

### Paso 1: Habilitar Developer Mode

1. Ve a **ChatGPT Settings**
2. Busca **Developer Mode** o **Connectors**
3. Habilítalo (requiere acceso developer)

### Paso 2: Agregar MCP Server

1. Ve a **Settings → Connectors → Create**
2. Nombre: `ChatGPT Dynamic Widgets`
3. URL: `https://frontend-production-d329.up.railway.app/mcp`
4. Guarda

### Paso 3: Prueba

En ChatGPT, di:
- "Crea un dashboard con ventas de $125,430"
- "Muestra un gráfico de barras con datos [10, 20, 30, 40]"
- "Genera una tabla con 3 productos"

## 📊 Tools Disponibles

### 1. create_dashboard

Crea un dashboard con métricas.

**Parámetros:**
- `title` (string): Título del dashboard
- `metrics` (array): Array de métricas con:
  - `value` (string): Valor (ej: "$125,430")
  - `label` (string): Etiqueta (ej: "Ingresos")
  - `color` (string): Color (green, blue, red, etc.)
  - `change` (string): Cambio (ej: "+18%")

**Ejemplo de uso:**
```
"Crea un dashboard con:
- Ingresos: $125,430 (+18%)
- Usuarios: 12,430 (+25%)
- Ventas: 1,234 (+15%)"
```

**ChatGPT mostrará:** Dashboard visual con métricas en tarjetas coloridas

### 2. create_chart

Crea un gráfico visual.

**Parámetros:**
- `title` (string): Título del gráfico
- `chartType` (enum): Tipo de gráfico (bar, line, pie, doughnut)
- `data` (number[]): Array de valores
- `labels` (string[]): Array de etiquetas

**Ejemplo de uso:**
```
"Crea un gráfico de barras llamado 'Ventas Mensuales' con:
- Oct: 15000
- Nov: 22000
- Dic: 18000
- Ene: 28000"
```

**ChatGPT mostrará:** Gráfico interactivo con Recharts

### 3. create_table

Crea una tabla de datos.

**Parámetros:**
- `title` (string): Título de la tabla
- `headers` (string[]): Headers de columnas
- `rows` (string[][]): Filas de datos (array de arrays)

**Ejemplo de uso:**
```
"Crea una tabla de Top 3 Productos con columnas:
Producto, Ventas, Stock

Y estos datos:
- iPhone, $89,450, 125
- MacBook, $145,320, 45
- AirPods, $34,890, 234"
```

**ChatGPT mostrará:** Tabla estilizada con los datos

## 🎨 Características del Widget

### En el iframe verás:
- ✅ Componentes React completamente interactivos
- ✅ Estilos Tailwind CSS
- ✅ Animaciones con Framer Motion
- ✅ Gráficos interactivos con Recharts
- ✅ Responsive design
- ✅ Tema consistente con tu aplicación

### SDK Bootstrap proporciona:
- ✅ Parches para `history.pushState/replaceState`
- ✅ Parches para `window.fetch` (CORS correcto)
- ✅ Manejo de enlaces externos via `openai.openExternal`
- ✅ Prevención de modificaciones HTML por ChatGPT
- ✅ Corrección de URLs de assets estáticos

## 🔍 Testing Local

### Paso 1: Run Dev Server
```bash
npm run dev
```

### Paso 2: Prueba el MCP Endpoint
```bash
curl http://localhost:3000/mcp
```

Deberías ver la respuesta del MCP server.

### Paso 3: Prueba un Widget
```bash
# Abre en navegador
http://localhost:3000/widgets/dashboard
```

Deberías ver el widget (sin datos porque no está en ChatGPT)

## 🚨 Troubleshooting

### Widget no se muestra en ChatGPT

**Causa:** MCP server no está registrado correctamente

**Solución:**
1. Verifica que la URL sea exactamente: `https://frontend-production-d329.up.railway.app/mcp`
2. Asegúrate de tener developer mode habilitado
3. Recarga ChatGPT

### Widget muestra pero sin datos

**Causa:** `window.openai` no está disponible

**Solución:** Esto es normal fuera de ChatGPT. Dentro de ChatGPT, el SDK detecta automáticamente los datos del tool call.

### Errores de CORS

**Causa:** Middleware no está funcionando

**Solución:**
1. Verifica que `middleware.ts` existe
2. Rebuild el proyecto: `npm run build`
3. Redeploy a Railway

### Assets (_next/) no cargan

**Causa:** `assetPrefix` no está configurado

**Solución:**
1. Verifica `next.config.ts` tiene `assetPrefix: baseURL`
2. Verifica `baseUrl.ts` tiene la URL correcta de Railway
3. Rebuild y redeploy

## 📚 Recursos

- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [MCP Server Guide](https://developers.openai.com/apps-sdk/build/mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎯 Arquitectura

```
ChatGPT
  ↓ [calls MCP tool]
MCP Server (/mcp)
  ↓ [returns templateUri]
ChatGPT
  ↓ [fetches resource HTML]
Widget Page (/widgets/*)
  ↓ [renders in iframe]
ChatGPT Chat
  ↓ [shows visual widget]
Usuario ve widget interactivo ✨
```

## ⚙️ Variables de Entorno

### Railway (auto-detectadas):
- `RAILWAY_PUBLIC_DOMAIN` - Dominio público de Railway

### Fallback:
- `NEXT_PUBLIC_BASE_URL` - URL base manual (opcional)

### Local Development:
- Por defecto usa `http://localhost:3000`

## 🔐 Seguridad

- ✅ CORS habilitado para ChatGPT
- ✅ Sin autenticación requerida (widgets públicos)
- ✅ SDK Bootstrap previene inyección de código
- ✅ MutationObserver previene modificaciones no autorizadas
- ✅ Fetches restringidos al dominio correcto

## 🎉 Resultado Final

Cuando todo está configurado:

1. Usuario: "Muéstrame las ventas del mes"
2. ChatGPT: Llama `create_chart` tool
3. Frontend: Genera HTML del gráfico
4. ChatGPT: Renderiza gráfico en iframe
5. Usuario: Ve gráfico interactivo en el chat ✨

**¡No más enlaces externos!** Todo se muestra inline en ChatGPT.
