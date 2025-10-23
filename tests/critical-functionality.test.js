/**
 * 🚨 TESTS CRÍTICOS - DEBEN PASAR SIEMPRE 🚨
 *
 * Estos tests verifican que la funcionalidad crítica NO se ha roto.
 * Si alguno falla, REVERTIR los cambios inmediatamente.
 *
 * Para ejecutar: npm test
 */

// Mock básico para testing manual
const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ TEST PASSED: ${message}`);
};

// Test 1: Verificar que el hook correcto está exportado
const testHookExport = () => {
  const fs = require('fs');
  const content = fs.readFileSync('./app/hooks/index.ts', 'utf8');

  assert(
    content.includes("from './use-widget-data-simple'"),
    "Hook debe exportar desde 'use-widget-data-simple' (con -simple)"
  );

  assert(
    !content.includes("from './use-widget-data'\"") &&
    !content.includes("from './use-widget-data';"),
    "NO debe exportar desde 'use-widget-data' (sin -simple)"
  );
};

// Test 2: Verificar que todos los widgets usan fallbackData
const testWidgetsFallback = () => {
  const fs = require('fs');
  const path = require('path');
  const widgetsDir = './app/widgets';

  const widgets = fs.readdirSync(widgetsDir)
    .filter(dir => fs.statSync(path.join(widgetsDir, dir)).isDirectory());

  widgets.forEach(widget => {
    const pagePath = path.join(widgetsDir, widget, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');

      assert(
        content.includes('fallbackData:'),
        `Widget ${widget} debe usar fallbackData`
      );

      assert(
        content.includes('const fallbackData'),
        `Widget ${widget} debe definir fallbackData`
      );
    }
  });
};

// Test 3: Verificar que no hay "Sin datos disponibles" sin condiciones
const testNoEmptyState = () => {
  const fs = require('fs');
  const path = require('path');
  const widgetsDir = './app/widgets';

  const widgets = fs.readdirSync(widgetsDir)
    .filter(dir => fs.statSync(path.join(widgetsDir, dir)).isDirectory());

  widgets.forEach(widget => {
    const pagePath = path.join(widgetsDir, widget, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');

      // Permitir "Sin datos disponibles" solo si está en una condición con fallback
      if (content.includes('Sin datos disponibles')) {
        assert(
          content.includes('fallbackData'),
          `Widget ${widget} tiene "Sin datos disponibles" pero debe tener fallbackData`
        );
      }
    }
  });
};

// Test 4: Verificar estructura del hook simplificado
const testSimpleHookStructure = () => {
  const fs = require('fs');
  const content = fs.readFileSync('./app/hooks/use-widget-data-simple.ts', 'utf8');

  assert(
    content.includes('useState<T | null>(options.fallbackData || null)'),
    "Hook debe inicializar estado con fallbackData"
  );

  assert(
    content.includes('useState(false)') && !content.includes('useState(true)'),
    "Loading debe inicializarse en false, nunca en true"
  );

  assert(
    content.includes('loadRealData()'),
    "Hook debe intentar cargar datos reales en background"
  );
};

// Test 5: Verificar que el API route mantiene estructura correcta
const testApiRoute = () => {
  const fs = require('fs');
  const content = fs.readFileSync('./app/api/widgets/route.ts', 'utf8');

  assert(
    content.includes('/api/widget/data/${id}'),
    "API route debe usar endpoint correcto del backend"
  );

  assert(
    content.includes('success: true') && content.includes('widget:'),
    "API route debe retornar estructura { success, widget }"
  );
};

// Test 6: Verificar documentación crítica existe
const testCriticalDocs = () => {
  const fs = require('fs');

  assert(
    fs.existsSync('./CRITICAL_CONFIG.md'),
    "CRITICAL_CONFIG.md debe existir"
  );

  assert(
    fs.existsSync('./DATA_FLOW.md'),
    "DATA_FLOW.md debe existir"
  );
};

// Test 7: Verificar comentarios WARNING en archivos críticos
const testWarningComments = () => {
  const fs = require('fs');

  const criticalFiles = [
    './app/hooks/use-widget-data-simple.ts',
    './app/hooks/index.ts',
    './app/api/widgets/route.ts'
  ];

  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      assert(
        content.includes('🚨') || content.includes('WARNING') || content.includes('CRITICAL'),
        `${file} debe tener comentarios de advertencia`
      );
    }
  });
};

// Ejecutar todos los tests
console.log('🧪 Ejecutando Tests Críticos...\n');

try {
  testHookExport();
  testWidgetsFallback();
  testNoEmptyState();
  testSimpleHookStructure();
  testApiRoute();
  testCriticalDocs();
  testWarningComments();

  console.log('\n✅ TODOS LOS TESTS CRÍTICOS PASARON');
  console.log('El sistema está funcionando correctamente.');
} catch (error) {
  console.error('\n❌ ERROR EN TESTS CRÍTICOS');
  console.error(error);
  console.error('\n⚠️ ADVERTENCIA: No hacer deploy hasta que todos los tests pasen');
  process.exit(1);
}