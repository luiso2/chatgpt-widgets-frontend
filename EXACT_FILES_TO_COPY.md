# Exact Files You Need to Copy from Template

## Files to Copy from Template

The working template is located at:
```
/Users/josemichaelhernandezvargas/Desktop/chatgpt-ui-mcp-template/
```

Your current project is at:
```
/Users/josemichaelhernandezvargas/Desktop/chatgpt-widgets-frontend/
```

### 1. Copy All Hook Files (CRITICAL)

**Source:** `/Users/josemichaelhernandezvargas/Desktop/chatgpt-ui-mcp-template/app/hooks/`

**Destination:** `/Users/josemichaelhernandezvargas/Desktop/chatgpt-widgets-frontend/app/hooks/`

**Files to copy:**

```bash
# Copy the entire hooks directory
cp -r /Users/josemichaelhernandezvargas/Desktop/chatgpt-ui-mcp-template/app/hooks \
      /Users/josemichaelhernandezvargas/Desktop/chatgpt-widgets-frontend/app/

# Verify all files are there:
ls -la /Users/josemichaelhernandezvargas/Desktop/chatgpt-widgets-frontend/app/hooks/
```

**Expected files:**
```
✓ types.ts
✓ use-openai-global.ts
✓ use-widget-props.ts
✓ use-display-mode.ts
✓ use-max-height.ts
✓ use-widget-state.ts
✓ use-is-chatgpt-app.ts
✓ use-call-tool.ts
✓ use-send-message.ts
✓ use-request-display-mode.ts
✓ use-open-external.ts
✓ index.ts
```

### 2. What NOT to Copy

Do NOT copy:
- ✗ app/page.tsx (template's is too simple, yours is better)
- ✗ app/custom-page/page.tsx (not needed)
- ✗ next.config.ts (yours is better with assetPrefix)
- ✗ middleware.ts (yours is better with RSC header)
- ✗ .next/ (build artifacts)
- ✗ node_modules/ (not needed)

### 3. Optional: Copy Tests for Reference

If you want to understand the hooks better:

```bash
# Just for reference - NOT needed for your app
cat /Users/josemichaelhernandezvargas/Desktop/chatgpt-ui-mcp-template/app/page.tsx
```

This shows how to use all the hooks in a proper widget page.

---

## Files You Need to MODIFY

After copying the hooks, you must modify these files:

### 1. app/mcp/route.ts

**Location:**
```
/Users/josemichaelhernandezvargas/Desktop/chatgpt-widgets-frontend/app/mcp/route.ts
```

**What to change:**
Add `server.registerResource()` calls for each widget type (dashboard, chart, table)

**Current code (lines 37-78):**
```typescript
const handler = createMcpHandler(async (server) => {
  // Only has Dashboard resource and tool
  // ... tool definitions ...
});
```

**What to add:**

Before each `server.registerTool()`, add `server.registerResource()`:

```typescript
const handler = createMcpHandler(async (server) => {
  // ===== DASHBOARD =====
  
  // ADD THIS RESOURCE REGISTRATION:
  server.registerResource(
    "dashboard-widget",
    dashboardWidget.templateUri,  // "ui://widget/dashboard.html"
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
            text: `<html>${html}</html>`,  // IMPORTANT: Full document wrapper
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

  // THEN your existing tool registration:
  server.registerTool(
    dashboardWidget.id,
    { ... },
    async (params) => { ... }
  );

  // ===== CHART (same pattern) =====
  server.registerResource(
    "chart-widget",
    chartWidget.templateUri,
    { ... },
    async (uri) => {
      const html = await getWidgetHtml(chartWidget.path);
      return { contents: [{ uri: uri.href, mimeType: "text/html+skybridge", text: `<html>${html}</html>`, _meta: {...} }] };
    }
  );
  
  server.registerTool(chartWidget.id, { ... }, async (params) => { ... });

  // ===== TABLE (same pattern) =====
  server.registerResource(
    "table-widget",
    tableWidget.templateUri,
    { ... },
    async (uri) => {
      const html = await getWidgetHtml(tableWidget.path);
      return { contents: [{ uri: uri.href, mimeType: "text/html+skybridge", text: `<html>${html}</html>`, _meta: {...} }] };
    }
  );
  
  server.registerTool(tableWidget.id, { ... }, async (params) => { ... });
});

export const GET = handler;
export const POST = handler;
```

**Reference template:**
```
/Users/josemichaelhernandezvargas/Desktop/chatgpt-ui-mcp-template/app/mcp/route.ts
(lines 48-74 show the registerResource pattern)
```

### 2. app/widgets/dashboard/page.tsx

**Location:**
```
/Users/josemichaelhernandezvargas/Desktop/chatgpt-widgets-frontend/app/widgets/dashboard/page.tsx
```

**Current code (lines 1-84):**
```typescript
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Dashboard from "@/components/widgets/Dashboard";

export default function DashboardWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const widgetId = searchParams.get("id");

  useEffect(() => {
    const loadWidgetData = async () => {
      try {
        // Priority 1: Load from widget ID (for direct URL access)
        if (widgetId) { ... }

        // Priority 2: Check if window.openai is available (running in ChatGPT MCP)
        if (typeof window !== "undefined" && (window as any).openai) {
          const openai = (window as any).openai;
          if (openai.getToolOutput) {  // ✗ THIS IS WRONG
            const output = await openai.getToolOutput();  // ✗ THIS DOESN'T EXIST
            ...
          }
        }
        // ...
      } catch (err) { ... }
    };
  }, [widgetId]);
  
  // ... rest of component
}
```

**Replace with:**

```typescript
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useWidgetProps, useDisplayMode, useMaxHeight } from "@/app/hooks";
import Dashboard from "@/components/widgets/Dashboard";

interface DashboardProps {
  title: string;
  metrics: Array<{
    value: string;
    label: string;
    color: string;
    change: string;
  }>;
}

export default function DashboardWidget() {
  // Get data from ChatGPT via hooks (CORRECT WAY)
  const props = useWidgetProps<DashboardProps>();
  const displayMode = useDisplayMode();
  const maxHeight = useMaxHeight();
  
  // Fallback for direct URL access (outside ChatGPT)
  const [localData, setLocalData] = useState<DashboardProps | null>(null);
  const [loading, setLoading] = useState(!props);
  const searchParams = useSearchParams();
  const widgetId = searchParams.get("id");

  useEffect(() => {
    // Only load from API if not in ChatGPT and no props
    if (!props && widgetId) {
      const loadData = async () => {
        try {
          const response = await fetch(`/api/widgets?id=${widgetId}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.widget) {
              setLocalData(result.widget);
            }
          }
        } catch (err) {
          console.error("Error loading widget:", err);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    } else {
      setLoading(false);
    }
  }, [props, widgetId]);

  const data = props || localData;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">No Data</h2>
          <p className="text-gray-600">View this widget in ChatGPT to see data</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6"
      style={{
        maxHeight: maxHeight ?? undefined,
        height: displayMode === "fullscreen" ? maxHeight ?? undefined : undefined,
      }}
    >
      <Dashboard {...data} />
    </div>
  );
}
```

### 3. app/widgets/chart/page.tsx

**Apply same pattern as dashboard:**
- Import hooks: `useWidgetProps`, `useDisplayMode`, `useMaxHeight`
- Replace `window.openai.getToolOutput()` with `useWidgetProps<ChartProps>()`
- Keep API fallback for direct URL access

### 4. app/widgets/table/page.tsx

**Apply same pattern as dashboard:**
- Import hooks
- Replace manual window.openai access with hooks

---

## Copy Commands (Ready to Run)

### 1. Copy all hooks:
```bash
cp -r /Users/josemichaelhernandezvargas/Desktop/chatgpt-ui-mcp-template/app/hooks \
      /Users/josemichaelhernandezvargas/Desktop/chatgpt-widgets-frontend/app/
```

### 2. Verify copy succeeded:
```bash
ls /Users/josemichaelhernandezvargas/Desktop/chatgpt-widgets-frontend/app/hooks/
# Should show: types.ts  use-*.ts files  index.ts
```

### 3. Check imports work:
```bash
cd /Users/josemichaelhernandezvargas/Desktop/chatgpt-widgets-frontend
npm run build
# Should compile without errors
```

---

## Files That Are Already Correct

✓ **app/layout.tsx** - SDK Bootstrap is already there (good!)
✓ **middleware.ts** - CORS is correct
✓ **baseUrl.ts** - Configuration is correct
✓ **next.config.ts** - Asset prefix is already configured
✓ **app/mcp/route.ts** - Tool definitions are correct (just need to add registerResource)
✓ **components/** - Widget components are fine

These DON'T need changes, just ensure widget PAGES get the hooks.

---

## Summary of Changes

### Must Copy (100% Critical):
- ✓ All 12 files from `app/hooks/`

### Must Modify (100% Critical):
- ✓ `app/mcp/route.ts` - Add registerResource calls
- ✓ `app/widgets/dashboard/page.tsx` - Use hooks instead of manual window.openai
- ✓ `app/widgets/chart/page.tsx` - Use hooks
- ✓ `app/widgets/table/page.tsx` - Use hooks

### Already Good (No Changes):
- ✓ Layout and bootstrap
- ✓ CORS middleware
- ✓ Configuration files
- ✓ Widget components

---

## Expected Time

- Copy hooks: 30 seconds
- Update MCP route: 5 minutes
- Update widget pages: 10 minutes
- Testing: 5 minutes

**Total: ~20 minutes to full ChatGPT widget support**

---

## Verification After Changes

```bash
# 1. Build the project
npm run build

# 2. Run dev server
npm run dev

# 3. Test MCP endpoint
curl http://localhost:3000/mcp

# 4. In ChatGPT (with developer mode enabled):
# - Add MCP: https://your-domain.com/mcp
# - Ask: "Create a dashboard with $100K revenue"
# - Should display inline widget ✅

# 5. Check if widgets have hooks imported
grep -r "useWidgetProps" app/widgets/
```

---

## Reference Files

**Template Examples:**
```
/Users/josemichaelhernandezvargas/Desktop/chatgpt-ui-mcp-template/app/hooks/use-widget-props.ts
- Shows how to use useWidgetProps hook

/Users/josemichaelhernandezvargas/Desktop/chatgpt-ui-mcp-template/app/page.tsx
- Shows how a widget page should use hooks

/Users/josemichaelhernandezvargas/Desktop/chatgpt-ui-mcp-template/app/mcp/route.ts
- Shows server.registerResource() pattern (lines 48-74)
```

After copying and modifying, your implementation will match the working template and widgets will display inline in ChatGPT!
