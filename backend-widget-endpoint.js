// ===================================================
// BACKEND ENDPOINT - Agregar al Backend Express.js
// ===================================================
// Este código debe agregarse a tu backend en Railway
// (gpt-widget-production.up.railway.app)

// 1. Asegúrate de tener un sistema de almacenamiento de widgets
// Puedes usar Redis, MongoDB, o memoria temporal como este ejemplo:

// Widget storage (en producción usar Redis o DB)
const widgetStorage = new Map();

// 2. Modificar los endpoints existentes de widgets para almacenar los datos
// Por ejemplo, en tu endpoint /api/widget/table, después de crear el widget:

// Ejemplo para el endpoint existente /api/widget/table
app.post('/api/widget/table', (req, res) => {
  const { title, headers, rows } = req.body;

  // Generar ID único para el widget
  const widgetId = generateWidgetId(); // Tu función existente

  // IMPORTANTE: Almacenar los datos del widget
  const widgetData = {
    type: 'table',
    title,
    headers,
    rows,
    createdAt: new Date().toISOString()
  };

  // Guardar en storage
  widgetStorage.set(widgetId, widgetData);

  // Tu respuesta existente
  return res.json({
    success: true,
    widgetId,
    widgetUrl: `https://frontend-production-d329.up.railway.app/widgets/table?id=${widgetId}`,
    // ... resto de tu respuesta
  });
});

// 3. NUEVO ENDPOINT - Agregar este endpoint para recuperar widgets por ID
// ================================================================

/**
 * GET /api/widget/data/:id
 * Recupera los datos de un widget por su ID
 */
app.get('/api/widget/data/:id', (req, res) => {
  const { id } = req.params;

  console.log(`📥 Fetching widget data for ID: ${id}`);

  // Buscar el widget en el storage
  const widgetData = widgetStorage.get(id);

  if (!widgetData) {
    console.log(`⚠️ Widget not found: ${id}`);
    return res.status(404).json({
      success: false,
      error: 'Widget not found',
      widgetId: id
    });
  }

  console.log(`✅ Widget found: ${id}`, widgetData.type);

  // Devolver los datos del widget
  return res.json({
    success: true,
    widget: widgetData,
    widgetId: id
  });
});

/**
 * GET /api/widgets/:id (endpoint alternativo)
 * Recupera los datos de un widget por su ID
 */
app.get('/api/widgets/:id', (req, res) => {
  const { id } = req.params;

  const widgetData = widgetStorage.get(id);

  if (!widgetData) {
    return res.status(404).json({
      success: false,
      error: 'Widget not found'
    });
  }

  return res.json({
    success: true,
    data: widgetData
  });
});

// 4. IMPORTANTE: Actualizar TODOS los endpoints de widgets
// para almacenar los datos cuando se crean:

// Ejemplo para /api/widget/chart
app.post('/api/widget/chart', (req, res) => {
  const { title, chartType, data, labels, widgetId: customId } = req.body;

  const widgetId = customId || generateWidgetId();

  // Almacenar datos
  widgetStorage.set(widgetId, {
    type: 'chart',
    title,
    chartType,
    data,
    labels,
    createdAt: new Date().toISOString()
  });

  // Respuesta
  return res.json({
    success: true,
    widgetId,
    widgetUrl: `https://frontend-production-d329.up.railway.app/widgets/chart?id=${widgetId}`,
    // ...
  });
});

// Ejemplo para /api/widget/dashboard
app.post('/api/widget/dashboard', (req, res) => {
  const { title, metrics, widgetId: customId } = req.body;

  const widgetId = customId || generateWidgetId();

  // Almacenar datos
  widgetStorage.set(widgetId, {
    type: 'dashboard',
    title,
    metrics,
    createdAt: new Date().toISOString()
  });

  return res.json({
    success: true,
    widgetId,
    widgetUrl: `https://frontend-production-d329.up.railway.app/widgets/dashboard?id=${widgetId}`,
    // ...
  });
});

// 5. OPCIONAL: Endpoint para listar todos los widgets
app.get('/api/widgets', (req, res) => {
  const widgets = Array.from(widgetStorage.entries()).map(([id, data]) => ({
    id,
    type: data.type,
    title: data.title,
    createdAt: data.createdAt
  }));

  return res.json({
    success: true,
    widgets,
    total: widgets.length
  });
});

// 6. OPCIONAL: Endpoint para eliminar widgets antiguos (limpieza)
app.delete('/api/widget/:id', (req, res) => {
  const { id } = req.params;

  if (widgetStorage.has(id)) {
    widgetStorage.delete(id);
    return res.json({
      success: true,
      message: 'Widget deleted',
      widgetId: id
    });
  }

  return res.status(404).json({
    success: false,
    error: 'Widget not found'
  });
});

// ===================================================
// CONFIGURACIÓN CON REDIS (Recomendado para producción)
// ===================================================

/*
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

// Guardar widget
async function saveWidget(widgetId, widgetData) {
  await redis.setex(
    `widget:${widgetId}`,
    3600 * 24, // TTL: 24 horas
    JSON.stringify(widgetData)
  );
}

// Recuperar widget
async function getWidget(widgetId) {
  const data = await redis.get(`widget:${widgetId}`);
  return data ? JSON.parse(data) : null;
}

// Usar en los endpoints:
app.get('/api/widget/data/:id', async (req, res) => {
  const { id } = req.params;
  const widgetData = await getWidget(id);

  if (!widgetData) {
    return res.status(404).json({ error: 'Widget not found' });
  }

  return res.json({ success: true, widget: widgetData });
});
*/

// ===================================================
// CORS Configuration
// ===================================================
// Asegúrate de permitir CORS desde tu frontend

app.use(cors({
  origin: [
    'https://frontend-production-d329.up.railway.app',
    'http://localhost:3000', // Para desarrollo
  ],
  credentials: true
}));

module.exports = { widgetStorage };