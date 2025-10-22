# 📊 ChatGPT Dynamic Widgets - Frontend

Frontend moderno con Next.js 15 para visualizar widgets dinámicos generados por la API de ChatGPT.

## 🚀 Demo en Vivo

- **Frontend**: [http://localhost:3002](http://localhost:3002) (desarrollo)
- **API Backend**: [https://gpt-widget-production.up.railway.app](https://gpt-widget-production.up.railway.app)

## ✨ Características

- ⚡ **Next.js 15** con App Router
- 🎨 **Tailwind CSS** para estilos modernos
- 📊 **Recharts** para gráficos interactivos
- ✨ **Framer Motion** para animaciones fluidas
- 🎯 **TypeScript** para type safety
- 📱 **Responsive Design** funciona en móvil, tablet y desktop

## 🎨 Widgets Disponibles

### 1. Dashboard
Panel de métricas con indicadores de rendimiento:
- Métricas con colores personalizados
- Indicadores de cambio (↑↓)
- Tarjetas con hover effects
- Animaciones al cargar

### 2. Charts (Gráficos)
Visualizaciones de datos con Recharts:
- **Bar Chart** - Gráficos de barras
- **Line Chart** - Gráficos de líneas
- **Pie Chart** - Gráficos circulares
- **Doughnut Chart** - Gráficos de dona

### 3. Table (Tablas)
Tablas modernas con:
- Headers con gradientes
- Filas alternadas
- Hover effects
- Responsive design

### 4. Timeline (Línea de Tiempo)
Líneas de tiempo visuales:
- Eventos con colores
- Línea vertical conectora
- Cards con información detallada
- Animaciones secuenciales

### 5. Comparison (Comparación)
Comparación de planes/productos:
- Cards con precios
- Lista de características
- Badge "Recomendado"
- Botones de acción

## 🛠️ Instalación y Uso

### Prerrequisitos

- Node.js 18+ instalado
- npm o yarn

### Instalación

```bash
# Navegar al proyecto
cd /Users/josemichaelhernandezvargas/Desktop/chatgpt-widgets-frontend

# Instalar dependencias (ya instaladas)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:3002**

### Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint
```

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "recharts": "^2.x",
    "framer-motion": "^11.x",
    "lucide-react": "^0.x"
  }
}
```

## 🎯 Estructura del Proyecto

```
chatgpt-widgets-frontend/
├── app/
│   ├── page.tsx              # Página principal con ejemplos
│   ├── layout.tsx            # Layout principal
│   └── globals.css           # Estilos globales
├── components/
│   └── widgets/
│       ├── Dashboard.tsx     # Componente Dashboard
│       ├── Chart.tsx         # Componente Chart
│       ├── Table.tsx         # Componente Table
│       ├── Timeline.tsx      # Componente Timeline
│       └── Comparison.tsx    # Componente Comparison
├── public/                   # Archivos estáticos
└── package.json
```

## 🎨 Personalización

### Colores de Métricas

Los colores disponibles para las métricas son:

```typescript
"text-green-600"   // 🟢 Verde - Positivo, ingresos
"text-blue-600"    // 🔵 Azul - Info, usuarios
"text-purple-600"  // 🟣 Morado - Engagement
"text-orange-600"  // 🟠 Naranja - Conversión
"text-red-600"     // 🔴 Rojo - Negativo, problemas
```

### Ejemplo de Uso

```tsx
import Dashboard from "@/components/widgets/Dashboard";

export default function Page() {
  return (
    <Dashboard
      title="Mis Métricas"
      metrics={[
        {
          value: "$125,430",
          label: "Ingresos",
          color: "text-green-600",
          change: "+18%"
        }
      ]}
    />
  );
}
```

## 🔌 Conexión con API Backend

Para conectar con la API de Railway:

```typescript
// Ejemplo de llamada a la API
const response = await fetch('https://gpt-widget-production.up.railway.app/api/widget/dashboard', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Mi Dashboard",
    metrics: [...]
  })
});

const data = await response.json();
// data.content contiene el markdown generado
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente Next.js
3. Deploy! 🚀

```bash
# O usando CLI
npm i -g vercel
vercel
```

### Railway

```bash
# Agregar Railway config
railway login
railway link
railway up
```

## 🤝 Integración con ChatGPT

Este frontend está diseñado para trabajar con el backend API que tu GPT de ChatGPT puede llamar:

1. **GPT llama a la API** → Genera datos en formato markdown
2. **Frontend consume la API** → Genera widgets visuales hermosos
3. **Usuario ve los resultados** → Visualización moderna y profesional

## 📝 Notas

- El puerto 3002 se usa porque el 3000 está ocupado por el backend
- Todos los componentes usan TypeScript para type safety
- Las animaciones están optimizadas para rendimiento
- El diseño es completamente responsive

## 🎯 Próximos Pasos

1. ✅ Frontend funcionando localmente
2. ⏳ Conectar con API de Railway dinámicamente
3. ⏳ Deploy a Vercel/Railway
4. ⏳ Agregar más tipos de widgets

## 🔗 Enlaces Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Framer Motion](https://www.framer.com/motion)
- [API Backend](https://gpt-widget-production.up.railway.app)

---

**Desarrollado con ❤️ usando Next.js 15 y Railway**
