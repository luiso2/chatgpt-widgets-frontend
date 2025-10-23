# 🚨 CONFIGURACIÓN CRÍTICA - NO MODIFICAR SIN LEER 🚨

## Estado Actual: FUNCIONANDO ✅
**Fecha de última verificación:** 23 de Octubre 2025
**Confirmado por:** Usuario en producción con widget ID: 4996dc0e09eed459

---

## ⚠️ REGLAS CRÍTICAS - NUNCA CAMBIAR

### 1. Sistema de Fallback (CRÍTICO)
**NUNCA REMOVER EL FALLBACK DATA**
```typescript
// ✅ CORRECTO - SIEMPRE incluir fallbackData
const { data } = useWidgetData<WidgetData>({
  fallbackData: fallbackData // OBLIGATORIO
});

// ❌ INCORRECTO - NUNCA hacer esto
const { data } = useWidgetData<WidgetData>(); // SIN FALLBACK = ROTO
```

### 2. Hook Simplificado (NO CAMBIAR)
**Archivo:** `/app/hooks/use-widget-data-simple.ts`
- SIEMPRE inicializar con `fallbackData`
- NUNCA mostrar loading que bloquee el renderizado
- Cargar datos reales en background sin afectar UI

### 3. Estructura de Respuesta del Backend
**MANTENER ESTOS CAMPOS EXACTOS:**
```javascript
// Backend DEBE responder con esta estructura
{
  success: true,
  url: widgetUrl,        // NO cambiar a widgetUrl o widget_url
  type: "dashboard",     // Tipo real del widget, NO "markdown"
  widgetId: id,
  widget: widgetData     // Datos del widget
}
```

### 4. Endpoints del Backend (NO MODIFICAR)
```javascript
// GET endpoints que DEBEN existir:
GET /api/widget/data/:id     // Principal
GET /api/widgets/:id         // Alternativo
GET /api/widget/:id          // Fallback

// POST endpoint para crear widgets:
POST /api/chatgpt/widget/:type
```

---

## 📋 FLUJO DE DATOS (ORDEN CRÍTICO)

1. **ChatGPT crea widget** → POST al backend
2. **Backend almacena** → En memoria (Map) con ID único
3. **Frontend carga** → Con ID en query param `?id=xxx`
4. **Hook useWidgetData**:
   - Paso 1: Muestra fallback data INMEDIATAMENTE
   - Paso 2: Intenta cargar de API en background
   - Paso 3: Si encuentra datos reales, actualiza
   - Paso 4: Si no, mantiene fallback (NUNCA vacío)

---

## 🛑 QUÉ NO HACER NUNCA

### ❌ NO cambiar el hook principal
```typescript
// NO cambiar de use-widget-data-simple a use-widget-data
export { useWidgetData } from './use-widget-data-simple'; // DEJAR ASÍ
```

### ❌ NO mostrar "Sin datos disponibles"
```typescript
// NUNCA permitir que el widget esté sin datos
if (!data) {
  return <div>Sin datos disponibles</div>; // ❌ PROHIBIDO
}
```

### ❌ NO cambiar la inicialización del estado
```typescript
// SIEMPRE inicializar con fallback
const [data, setData] = useState(options.fallbackData || null); // ✅ CORRECTO
const [loading, setLoading] = useState(false); // ✅ No bloquear con true
```

### ❌ NO modificar la estructura de URLs
```typescript
// Frontend SIEMPRE debe construir URLs así:
const response = await fetch(`/api/widgets?id=${widgetId}`);
```

---

## ✅ CHECKLIST ANTES DE CUALQUIER CAMBIO

Antes de modificar CUALQUIER archivo, verifica:

- [ ] ¿El cambio mantiene el fallbackData obligatorio?
- [ ] ¿Los widgets seguirán mostrando datos inmediatamente?
- [ ] ¿Se mantiene la estructura de respuesta del backend?
- [ ] ¿Los endpoints siguen siendo los mismos?
- [ ] ¿El hook simplificado sigue siendo el exportado?
- [ ] ¿No se introducen pantallas de carga bloqueantes?
- [ ] ¿No se permite estado "Sin datos disponibles"?

---

## 🔧 ARCHIVOS CRÍTICOS - MANEJAR CON CUIDADO

### Alta Criticidad (NO modificar sin extremo cuidado):
- `/app/hooks/use-widget-data-simple.ts` - Hook principal
- `/app/hooks/index.ts` - Exportación del hook
- `/app/api/widgets/route.ts` - Proxy al backend
- Todos los archivos `/app/widgets/*/page.tsx` - Páginas de widgets

### Media Criticidad:
- `/app/hooks/use-widget-data.ts` - Hook alternativo (no usado actualmente)
- `/components/widgets/*` - Componentes visuales

---

## 🐛 PROBLEMAS CONOCIDOS Y SOLUCIONES

### Problema: "Sin datos disponibles"
**Causa:** No se está usando fallbackData
**Solución:** SIEMPRE pasar fallbackData al hook useWidgetData

### Problema: Pantalla de carga infinita
**Causa:** Loading inicializado en true
**Solución:** Inicializar loading en false, cargar en background

### Problema: Widget no carga datos del backend
**Causa:** URL incorrecta o endpoint faltante
**Solución:** Verificar que el backend tiene todos los GET endpoints listados

---

## 📝 NOTAS DE MANTENIMIENTO

### Para agregar nuevas funcionalidades:
1. NUNCA modificar el flujo de fallback
2. Agregar features de forma aditiva, no destructiva
3. Testear que widgets siguen mostrándose con y sin backend
4. Verificar en ChatGPT real antes de deployar

### Para debugging:
- Los logs en consola son intencionales y ayudan
- Verificar Network tab para las llamadas API
- El indicador de "Datos: xxx" en desarrollo es útil

---

## 🚀 COMANDOS DE VERIFICACIÓN

```bash
# Verificar que el hook correcto está exportado
grep -n "useWidgetData.*from.*simple" app/hooks/index.ts

# Verificar que todos los widgets usan fallback
grep -r "fallbackData:" app/widgets/

# Verificar estructura del backend
cd ../chatgpt-widget-api-express
grep -n "success.*url.*type" src/app.js
```

---

## ⚡ CONTACTO EN CASO DE PROBLEMAS

Si algo se rompe después de un cambio:
1. Revisar este documento
2. Revertir al commit: `ebb8b76` (último funcionando confirmado)
3. Verificar que se mantienen TODAS las reglas críticas

---

**RECUERDA:** El sistema actual FUNCIONA. Cualquier "mejora" que rompa el fallback o permita estados vacíos NO es una mejora.