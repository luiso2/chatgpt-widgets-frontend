import Dashboard from "@/components/widgets/Dashboard";
import Chart from "@/components/widgets/Chart";
import Table from "@/components/widgets/Table";
import Timeline from "@/components/widgets/Timeline";
import Comparison from "@/components/widgets/Comparison";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📊 ChatGPT Dynamic Widgets
          </h1>
          <p className="text-gray-600 mt-2">
            Visualización moderna de datos con Next.js 15 y Tailwind CSS
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Dashboard Widget */}
        <section>
          <Dashboard
            title="Dashboard de Ventas Octubre 2025"
            metrics={[
              {
                value: "$125,430",
                label: "Ingresos Totales",
                color: "text-green-600",
                change: "+18%",
              },
              {
                value: "12,430",
                label: "Usuarios Activos",
                color: "text-blue-600",
                change: "+25%",
              },
              {
                value: "1,234",
                label: "Nuevos Registros",
                color: "text-purple-600",
                change: "+15%",
              },
              {
                value: "856",
                label: "Pedidos Completados",
                color: "text-orange-600",
                change: "+12%",
              },
              {
                value: "245",
                label: "Tickets Soporte",
                color: "text-red-600",
                change: "-4.5%",
              },
            ]}
          />
        </section>

        {/* Chart Widget */}
        <section>
          <Chart
            title="Ventas Mensuales 2025"
            type="bar"
            data={[15000, 22000, 18000, 28000, 32000, 25000]}
            labels={["Ene", "Feb", "Mar", "Abr", "May", "Jun"]}
          />
        </section>

        {/* Line Chart */}
        <section>
          <Chart
            title="Tendencia de Usuarios"
            type="line"
            data={[1200, 1500, 1800, 2100, 2400, 2800]}
            labels={["Ene", "Feb", "Mar", "Abr", "May", "Jun"]}
          />
        </section>

        {/* Table Widget */}
        <section>
          <Table
            title="Top 10 Productos Más Vendidos"
            headers={["Producto", "Categoría", "Ventas", "Stock", "Estado"]}
            rows={[
              ["iPhone 15 Pro", "Tecnología", "$89,450", "125", "Activo"],
              ["MacBook Air M3", "Computadoras", "$145,320", "45", "Activo"],
              ["AirPods Pro 2", "Audio", "$34,890", "234", "Activo"],
              ["iPad Pro", "Tablets", "$67,890", "89", "Activo"],
              ["Apple Watch Series 9", "Wearables", "$45,670", "156", "Activo"],
            ]}
          />
        </section>

        {/* Timeline Widget */}
        <section>
          <Timeline
            title="Historia del Proyecto"
            events={[
              {
                date: "15 Enero 2025",
                title: "Lanzamiento Beta",
                description: "Primera versión beta lanzada al público con funcionalidades básicas.",
                color: "blue",
              },
              {
                date: "1 Marzo 2025",
                title: "Versión 1.0",
                description: "Lanzamiento oficial con todas las características principales implementadas.",
                color: "green",
              },
              {
                date: "15 Mayo 2025",
                title: "Integración API",
                description: "Integración completa con servicios externos y mejoras de rendimiento.",
                color: "purple",
              },
              {
                date: "1 Agosto 2025",
                title: "Expansión Internacional",
                description: "Lanzamiento en 5 países adicionales con soporte multiidioma.",
                color: "orange",
              },
            ]}
          />
        </section>

        {/* Comparison Widget */}
        <section>
          <Comparison
            title="Comparación de Planes"
            items={[
              {
                name: "Plan Básico",
                price: "$9/mes",
                features: [
                  "5 usuarios",
                  "10GB almacenamiento",
                  "Soporte por email",
                  "Dashboard básico",
                ],
                highlight: false,
              },
              {
                name: "Plan Pro",
                price: "$29/mes",
                features: [
                  "Usuarios ilimitados",
                  "100GB almacenamiento",
                  "Soporte prioritario 24/7",
                  "Dashboard avanzado",
                  "API Access",
                  "Integraciones",
                ],
                highlight: true,
              },
              {
                name: "Plan Enterprise",
                price: "$99/mes",
                features: [
                  "Todo de Plan Pro",
                  "Almacenamiento ilimitado",
                  "Soporte dedicado",
                  "Custom features",
                  "SLA 99.9%",
                  "On-premise option",
                ],
                highlight: false,
              },
            ]}
          />
        </section>

        {/* Pie Chart */}
        <section>
          <Chart
            title="Distribución de Ventas por Categoría"
            type="pie"
            data={[30, 25, 20, 15, 10]}
            labels={["Tecnología", "Ropa", "Hogar", "Deportes", "Otros"]}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>
            🚀 Powered by{" "}
            <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Next.js 15
            </span>{" "}
            +{" "}
            <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Railway API
            </span>
          </p>
          <p className="mt-2 text-sm">
            API Backend:{" "}
            <a
              href="https://gpt-widget-production.up.railway.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              gpt-widget-production.up.railway.app
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
