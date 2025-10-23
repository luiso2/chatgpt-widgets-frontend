import Dashboard from "@/components/widgets/Dashboard";
import Chart from "@/components/widgets/Chart";
import Table from "@/components/widgets/Table";
import Timeline from "@/components/widgets/Timeline";
import Comparison from "@/components/widgets/Comparison";
import Tree from "@/components/widgets/Tree";

// Backend API URL - use environment variable
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gpt-widget-production.up.railway.app";
const BACKEND_API_DOMAIN = BACKEND_API_URL.replace("https://", "").replace("http://", "");

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

        {/* Tree Widget - Premium */}
        <section>
          <Tree
            title="Sistema de Archivos del Proyecto"
            variant="premium"
            showSearch={true}
            multiSelect={true}
            data={[
              {
                id: "1",
                label: "src",
                icon: "folder",
                isExpanded: true,
                children: [
                  {
                    id: "1-1",
                    label: "components",
                    icon: "folder",
                    isExpanded: true,
                    badge: "15",
                    children: [
                      { id: "1-1-1", label: "Dashboard.tsx", icon: "code" },
                      { id: "1-1-2", label: "Chart.tsx", icon: "code" },
                      { id: "1-1-3", label: "Table.tsx", icon: "code" },
                      { id: "1-1-4", label: "Tree.tsx", icon: "code", badge: "New" },
                    ],
                  },
                  {
                    id: "1-2",
                    label: "hooks",
                    icon: "folder",
                    badge: "25",
                    children: [
                      { id: "1-2-1", label: "use-tree-data.ts", icon: "code" },
                      { id: "1-2-2", label: "use-tree-selection.ts", icon: "code" },
                      { id: "1-2-3", label: "use-data-pagination.ts", icon: "code" },
                      { id: "1-2-4", label: "use-debounce.ts", icon: "code" },
                      { id: "1-2-5", label: "use-clipboard.ts", icon: "code" },
                    ],
                  },
                  {
                    id: "1-3",
                    label: "api",
                    icon: "folder",
                    children: [
                      { id: "1-3-1", label: "widgets", icon: "folder" },
                      { id: "1-3-2", label: "mcp", icon: "folder" },
                    ],
                  },
                ],
              },
              {
                id: "2",
                label: "public",
                icon: "folder",
                children: [
                  { id: "2-1", label: "logo.png", icon: "image" },
                  { id: "2-2", label: "favicon.ico", icon: "image" },
                ],
              },
              {
                id: "3",
                label: "docs",
                icon: "folder",
                children: [
                  { id: "3-1", label: "README.md", icon: "document" },
                  { id: "3-2", label: "API.md", icon: "document" },
                  { id: "3-3", label: "HOOKS.md", icon: "document", badge: "New" },
                ],
              },
              {
                id: "4",
                label: "package.json",
                icon: "package",
              },
              {
                id: "5",
                label: "tsconfig.json",
                icon: "settings",
              },
            ]}
          />
        </section>

        {/* Tree Widget - Neon Variant */}
        <section>
          <Tree
            title="Estructura de Base de Datos"
            variant="neon"
            showSearch={true}
            data={[
              {
                id: "db1",
                label: "PostgreSQL Database",
                icon: "database",
                isExpanded: true,
                badge: "Active",
                children: [
                  {
                    id: "db1-1",
                    label: "Tables",
                    icon: "folder",
                    isExpanded: true,
                    badge: "8",
                    children: [
                      { id: "db1-1-1", label: "users", icon: "users", badge: "125K" },
                      { id: "db1-1-2", label: "products", icon: "package", badge: "5.2K" },
                      { id: "db1-1-3", label: "orders", icon: "file", badge: "89K" },
                      { id: "db1-1-4", label: "widgets", icon: "code", badge: "245" },
                    ],
                  },
                  {
                    id: "db1-2",
                    label: "Views",
                    icon: "folder",
                    badge: "3",
                    children: [
                      { id: "db1-2-1", label: "user_analytics", icon: "file" },
                      { id: "db1-2-2", label: "sales_summary", icon: "file" },
                    ],
                  },
                  {
                    id: "db1-3",
                    label: "Indexes",
                    icon: "folder",
                    badge: "12",
                  },
                ],
              },
              {
                id: "db2",
                label: "Redis Cache",
                icon: "database",
                badge: "Hot",
                children: [
                  { id: "db2-1", label: "session_cache", icon: "file" },
                  { id: "db2-2", label: "api_cache", icon: "file" },
                ],
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
              href={BACKEND_API_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {BACKEND_API_DOMAIN}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
