# Variables de Entorno para Backend en Railway

## 📋 Variables Requeridas

Configura estas variables de entorno en el servicio backend de Railway:

### 1. Configuración de la Aplicación

```bash
NODE_ENV=production
PORT=3000
API_PREFIX=api
API_VERSION=v1
```

### 2. JWT/Autenticación

```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**⚠️ IMPORTANTE:** Cambia `JWT_SECRET` por una clave segura y única.

### 3. Directus CMS (si se usa)

```bash
DIRECTUS_URL=https://algoritmo-algoritmo.dqyvuv.easypanel.host
DIRECTUS_TOKEN=your-directus-service-token
```

### 4. CORS

```bash
CORS_ORIGIN=https://frontend-production-d329.up.railway.app,https://chat.openai.com
```

**Nota:** Incluye el dominio del frontend y ChatGPT para permitir peticiones cross-origin.

### 5. URLs del Backend (opcional, auto-detectado por Railway)

```bash
BACKEND_URL=https://gpt-widget-production.up.railway.app
```

## 🚀 Cómo Configurar en Railway

### Opción 1: Via Railway Dashboard (Recomendado)

1. Ve a https://railway.app/dashboard
2. Selecciona el proyecto "GPT1"
3. Click en el servicio backend
4. Ve a "Variables"
5. Añade cada variable con su valor
6. Click "Deploy" para aplicar cambios

### Opción 2: Via Railway CLI

```bash
# Cambiar al servicio backend
railway service

# Configurar cada variable
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set API_PREFIX=api
railway variables set API_VERSION=v1
railway variables set JWT_SECRET=your-secret-key
railway variables set JWT_EXPIRES_IN=7d
railway variables set CORS_ORIGIN=https://frontend-production-d329.up.railway.app,https://chat.openai.com

# Ver todas las variables configuradas
railway variables
```

## 🔒 Seguridad

- ❌ **NO** commits archivos `.env` con secrets al repositorio
- ✅ Usa variables de entorno de Railway para production
- ✅ Rota `JWT_SECRET` regularmente
- ✅ Restringe `CORS_ORIGIN` solo a dominios necesarios

## ✅ Verificación

Después de configurar, verifica que el backend funciona:

```bash
curl https://gpt-widget-production.up.railway.app/api/health
```

Deberías recibir una respuesta 200 OK.

## 📚 Referencias

- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Backend Configuration](.env.production)
