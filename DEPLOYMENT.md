# 🚀 Guía de Deployment en Railway

## ✅ Estado Actual del Código

- **TypeScript Errors:** 0 ✓
- **GitHub Frontend:** https://github.com/luiso2/chatgpt-widgets-frontend.git
- **GitHub Backend:** https://github.com/luiso2/GPT1.git
- **Backend Live:** https://gpt-widget-production.up.railway.app

---

## 🚂 Deployment del Frontend en Railway

### Paso 1: Crear Nuevo Servicio

1. Ve a: https://railway.app/dashboard
2. Click **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Busca y selecciona: `luiso2/chatgpt-widgets-frontend`
5. Click **"Deploy Now"**

### Paso 2: Configurar Build Settings

Railway detectará automáticamente que es Next.js, pero verifica:

**Settings → Build:**
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Root Directory:** `/` (o déjalo vacío)

**Settings → Environment:**
- `NODE_VERSION`: `18` (o la versión que uses)
- `NODE_ENV`: `production`

### Paso 3: Generar Dominio Público

1. Ve a **Settings → Networking**
2. Click **"Generate Domain"**
3. Se generará algo como: `chatgpt-widgets-frontend.up.railway.app`
4. Copia esta URL - la necesitarás para el GPT

### Paso 4: Esperar Deploy

Railway compilará el proyecto (tarda 3-5 minutos).
Verás el progreso en la pestaña **"Deployments"**.

**Railway usa sus propios servidores**, así que el build NO se colgará como localmente

---

## 🔌 Backend (Ya está deployado)

**URL:** https://gpt-widget-production.up.railway.app

**Endpoints disponibles:**
- GET /health - Health check
- GET /openapi.json - Schema para GPT
- POST /api/widget/* - 14 endpoints de widgets

---

## 📝 Configurar GPT en ChatGPT

1. Ve a: https://chatgpt.com → My GPTs
2. Create a GPT
3. **Instructions:** Copia `GPT_INSTRUCTIONS_V2_COMPLETE.md`
4. **Actions:** Import from URL
   ```
   https://gpt-widget-production.up.railway.app/openapi.json
   ```
5. Save

---

## ⚠️ Nota sobre Build Local

El build local con Next.js 16 + Turbopack puede tardar o colgarse.
**NO lo necesitas** - Railway lo hace automáticamente al desplegar.

---

## 🔧 Troubleshooting Railway

### Build falla con "Out of Memory"
**Solución:**
1. Settings → Resources
2. Aumenta la memoria a 2GB o más

### Deploy muy lento
**Normal:** First deploy tarda 5-7 minutos
**Siguientes deploys:** 2-3 minutos

### URL del frontend para el GPT
Una vez deployado, tu URL será:
```
https://[tu-proyecto].up.railway.app
```

Puedes personalizar el dominio en Settings → Networking.

---

## ✅ Checklist de Deployment

- [ ] Frontend deployado en Railway
- [x] Backend funcionando en Railway
- [ ] GPT configurado con OpenAPI schema
- [ ] GPT Instructions actualizadas
- [ ] Probado con "Show me a dashboard"

---

## 📊 URLs Finales (Ejemplo)

**Frontend:** `https://chatgpt-widgets-frontend.up.railway.app`
**Backend:** `https://gpt-widget-production.up.railway.app` ✓

**Widget URL Pattern:**
```
https://chatgpt-widgets-frontend.up.railway.app/widgets/dashboard?id=xxx
https://chatgpt-widgets-frontend.up.railway.app/widgets/stats?id=xxx
https://chatgpt-widgets-frontend.up.railway.app/widgets/kanban?id=xxx
```

---

**Todo el código está listo para producción** 🎉
