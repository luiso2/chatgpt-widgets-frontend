// ============================================
// JavaScript Example - Create Widget API Call
// ============================================

const API_URL = "https://frontend-production-d329.up.railway.app/api/widgets";

// Datos del widget
const widgetData = {
  type: "chart",
  title: "Ventas Mensuales 2025",
  chartType: "bar",
  labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
  data: [12000, 15000, 18000, 22000, 25000, 27000]
};

// Función para crear el widget
async function createWidget(data) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating widget:", error);
    throw error;
  }
}

// Ejecutar y mostrar resultado
async function main() {
  console.log("📊 Creando widget...\n");
  console.log("Datos enviados:");
  console.log(JSON.stringify(widgetData, null, 2));
  console.log("\n" + "=".repeat(50) + "\n");

  const result = await createWidget(widgetData);

  console.log("✅ Widget creado exitosamente!\n");
  console.log("Respuesta completa:");
  console.log(JSON.stringify(result, null, 2));
  console.log("\n" + "=".repeat(50) + "\n");

  // Extraer el contenido formateado (markdown o content)
  const content = result.markdown || result.content;

  if (content) {
    console.log("📝 Contenido formateado (markdown/content):\n");
    console.log(content);
    console.log("\n" + "=".repeat(50) + "\n");
  } else {
    console.log("⚠️  No se encontró campo 'markdown' o 'content' en la respuesta");
  }
}

// Ejecutar
main().catch(console.error);

// ============================================
// Para usar en navegador:
// ============================================

/*
// Copiar y pegar en la consola del navegador:

fetch("https://frontend-production-d329.up.railway.app/api/widgets", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "chart",
    title: "Ventas Mensuales 2025",
    chartType: "bar",
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    data: [12000, 15000, 18000, 22000, 25000, 27000]
  })
})
.then(res => res.json())
.then(data => {
  console.log("Respuesta:", data);
  console.log("\nContenido formateado:");
  console.log(data.markdown || data.content);
});
*/
