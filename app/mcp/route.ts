import { baseURL } from "@/baseUrl";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

// Force dynamic rendering for this API route
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_API_URL = "https://gpt-widget-production.up.railway.app";

// Helper to fetch HTML content
const getWidgetHtml = async (path: string) => {
  const result = await fetch(`${baseURL}${path}`);
  return await result.text();
};

type WidgetConfig = {
  id: string;
  title: string;
  templateUri: string;
  path: string;
  description: string;
  invoking: string;
  invoked: string;
};

function widgetMeta(widget: WidgetConfig) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}

const handler = createMcpHandler(async (server) => {
  // Dashboard Widget
  const dashboardWidget: WidgetConfig = {
    id: "create_dashboard",
    title: "Create Dashboard",
    templateUri: "ui://widget/dashboard.html",
    path: "/widgets/dashboard",
    description: "Display metrics dashboard with KPIs",
    invoking: "Creating dashboard...",
    invoked: "Dashboard created",
  };

  server.registerResource(
    "dashboard-widget",
    dashboardWidget.templateUri,
    {
      title: dashboardWidget.title,
      description: dashboardWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": dashboardWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => {
      const html = await getWidgetHtml(dashboardWidget.path);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/html+skybridge",
            text: html,
            _meta: {
              "openai/widgetDescription": dashboardWidget.description,
              "openai/widgetPrefersBorder": true,
              "openai/widgetDomain": baseURL,
            },
          },
        ],
      };
    }
  );

  server.registerTool(
    dashboardWidget.id,
    {
      title: dashboardWidget.title,
      description: "Create a dashboard with metrics and KPIs. Provide title and metrics array.",
      inputSchema: {
        title: z.string().describe("Dashboard title"),
        metrics: z.array(
          z.object({
            value: z.string().describe("Metric value (e.g., '$125,430')"),
            label: z.string().describe("Metric label (e.g., 'Total Revenue')"),
            color: z.string().describe("Color class (e.g., 'green', 'blue', 'red')"),
            change: z.string().describe("Change percentage (e.g., '+18%')"),
          })
        ).describe("Array of metrics to display"),
      },
      _meta: widgetMeta(dashboardWidget),
    },
    async (params) => {
      return {
        content: [
          {
            type: "text",
            text: `Dashboard "${params.title}" created with ${params.metrics.length} metrics`,
          },
        ],
        structuredContent: params,
        _meta: widgetMeta(dashboardWidget),
      };
    }
  );

  // Chart Widget
  const chartWidget: WidgetConfig = {
    id: "create_chart",
    title: "Create Chart",
    templateUri: "ui://widget/chart.html",
    path: "/widgets/chart",
    description: "Display data as bar, line, pie, or doughnut chart",
    invoking: "Creating chart...",
    invoked: "Chart created",
  };

  server.registerResource(
    "chart-widget",
    chartWidget.templateUri,
    {
      title: chartWidget.title,
      description: chartWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": chartWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => {
      const html = await getWidgetHtml(chartWidget.path);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/html+skybridge",
            text: html,
            _meta: {
              "openai/widgetDescription": chartWidget.description,
              "openai/widgetPrefersBorder": true,
              "openai/widgetDomain": baseURL,
            },
          },
        ],
      };
    }
  );

  server.registerTool(
    chartWidget.id,
    {
      title: chartWidget.title,
      description: "Create a chart visualization. Provide title, chart type, data array, and labels array.",
      inputSchema: {
        title: z.string().describe("Chart title"),
        chartType: z.enum(["bar", "line", "pie", "doughnut"]).describe("Type of chart"),
        data: z.array(z.number()).describe("Data values for the chart"),
        labels: z.array(z.string()).describe("Labels for each data point"),
      },
      _meta: widgetMeta(chartWidget),
    },
    async (params) => {
      return {
        content: [
          {
            type: "text",
            text: `${params.chartType} chart "${params.title}" created with ${params.data.length} data points`,
          },
        ],
        structuredContent: params,
        _meta: widgetMeta(chartWidget),
      };
    }
  );

  // Table Widget
  const tableWidget: WidgetConfig = {
    id: "create_table",
    title: "Create Table",
    templateUri: "ui://widget/table.html",
    path: "/widgets/table",
    description: "Display data in a table format",
    invoking: "Creating table...",
    invoked: "Table created",
  };

  server.registerResource(
    "table-widget",
    tableWidget.templateUri,
    {
      title: tableWidget.title,
      description: tableWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": tableWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => {
      const html = await getWidgetHtml(tableWidget.path);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/html+skybridge",
            text: html,
            _meta: {
              "openai/widgetDescription": tableWidget.description,
              "openai/widgetPrefersBorder": true,
              "openai/widgetDomain": baseURL,
            },
          },
        ],
      };
    }
  );

  server.registerTool(
    tableWidget.id,
    {
      title: tableWidget.title,
      description: "Create a data table. Provide title, column headers, and rows of data.",
      inputSchema: {
        title: z.string().describe("Table title"),
        headers: z.array(z.string()).describe("Column headers"),
        rows: z.array(z.array(z.string())).describe("Table rows (array of arrays)"),
      },
      _meta: widgetMeta(tableWidget),
    },
    async (params) => {
      return {
        content: [
          {
            type: "text",
            text: `Table "${params.title}" created with ${params.rows.length} rows`,
          },
        ],
        structuredContent: params,
        _meta: widgetMeta(tableWidget),
      };
    }
  );
});

export const GET = handler;
export const POST = handler;
