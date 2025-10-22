# MCP Template vs Current Implementation: Detailed File Analysis

## FILE-BY-FILE COMPARISON

### 1. ROOT CONFIGURATION FILES

#### package.json
| File | Template | Current | Status |
|------|----------|---------|--------|
| Dependencies | @modelcontextprotocol/sdk ^1.20.0, mcp-handler ^1.0.2 | @modelcontextprotocol/sdk ^1.20.1, mcp-handler ^1.0.3 | ✓ Compatible |
| Next.js | 15.5.4 | 16.0.0 | ✓ Current is newer |
| React | 19.1.0 | 19.2.0 | ✓ Current is newer |

#### next.config.ts
**Template:**
```typescript
const nextConfig: NextConfig = {
  serverExternalPackages: ["mcp-handler"],
};
```

**Current:**
```typescript
const nextConfig: NextConfig = {
  assetPrefix: baseURL,
};
```

**Impact:** Current implementation has `assetPrefix` which is CRITICAL for iframe asset loading. Template doesn't need it because it doesn't have complex widget assets.

#### middleware.ts
**Template:**
```typescript
// Returns 204 with CORS headers
// Adds CORS headers to all responses
```

**Current:**
```typescript
// Same pattern but with "RSC" header
// Better: includes "Access-Control-Max-Age": "86400"
```

**Impact:** Current implementation is SLIGHTLY better (more explicit headers)

#### baseUrl.ts
**Both:** Identical logic - uses RAILWAY_PUBLIC_DOMAIN first, fallback to localhost

---

### 2. MCP SERVER (app/mcp/route.ts)

#### Template Structure:
```
✓ createMcpHandler wrapper
✓ server.registerResource() - CRITICAL
✓ server.registerTool() - with metadata reference
✓ Tool response includes _meta
✓ Resources return complete HTML with <html> wrapper
```

#### Current Structure:
```
✓ createMcpHandler wrapper
✗ NO server.registerResource() calls - MISSING!
✓ server.registerTool() - with metadata
✓ Tool response includes _meta
✗ Resources NOT registered (widgets served via REST API)
```

#### Critical Difference:
Template:
```typescript
server.registerResource(
  "dashboard-widget",
  "ui://widget/dashboard.html",
  { mimeType: "text/html+skybridge", _meta: {...} },
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: "text/html+skybridge",
      text: `<html>${contentWidget.html}</html>`,
      _meta: {...}
    }]
  })
);
```

Current:
```typescript
// Only has tools, no resources
// Widgets are served via separate /widgets/* pages + /api/widgets REST endpoint
```

**Impact:** WITHOUT resource registration, ChatGPT can't fetch the widget HTML!

---

### 3. APP LAYOUT (app/layout.tsx)

#### Template:
- Simple SDK Bootstrap
- Uses inline `<script>` tag
- IIFE pattern: `("(" + (() => {...}).toString() + ")()")`
- Patches: history.pushState, history.replaceState, fetch, click handler for links

#### Current:
- SDK Bootstrap using `dangerouslySetInnerHTML`
- BETTER: Includes CSS font URL fixing
- Same patches as template
- More comprehensive error handling

**Impact:** Current is MORE ROBUST but uses riskier pattern

---

### 4. HOOKS (MOST CRITICAL)

#### Template Has (all in app/hooks/):
```
✓ use-openai-global.ts - subscribes to window.openai updates
✓ use-widget-props.ts - gets toolOutput
✓ use-display-mode.ts - gets displayMode
✓ use-max-height.ts - gets maxHeight
✓ use-widget-state.ts - manages persistent widget state
✓ use-is-chatgpt-app.ts - detects ChatGPT environment
✓ use-call-tool.ts - calls MCP tools
✓ use-send-message.ts - sends follow-up messages
✓ use-request-display-mode.ts - requests display mode changes
✓ use-open-external.ts - opens external links
✓ types.ts - TypeScript types for window.openai
✓ index.ts - exports
```

#### Current Has:
```
✗ NO app/hooks/ directory
✗ All hooks missing
✗ Widgets manually check window.openai (wrong way)
```

**Impact:** THIS IS THE CRITICAL MISSING PIECE!

---

### 5. MAIN PAGE (app/page.tsx)

#### Template:
```typescript
"use client";
// Uses hooks:
const toolOutput = useWidgetProps<{name?: string; ...}>();
const maxHeight = useMaxHeight();
const displayMode = useDisplayMode();
const requestDisplayMode = useRequestDisplayMode();
const isChatGptApp = useIsChatGptApp();

// Conditional rendering based on displayMode and isChatGptApp
// Shows error if window.openai not available
```

#### Current:
```typescript
// Static page showing all widgets
// NOT a widget itself
// Displays Dashboard, Chart, Table, Timeline, Comparison components
// Shows examples/preview of widgets
```

**Impact:** Template's page IS the widget. Current's page is just a demo.

---

### 6. WIDGET PAGES

#### Template:
- None explicitly, just uses app/page.tsx as widget page
- Any page can be a widget by using hooks

#### Current:
```
app/widgets/dashboard/page.tsx
app/widgets/chart/page.tsx
app/widgets/table/page.tsx
app/widget/page.tsx (generic)
```

Each widget page tries to access `window.openai.getToolOutput()` which:
1. Doesn't exist (should be property, not function)
2. Uses wrong API
3. Not wrapped in proper React hook pattern

---

## KEY MISSING PIECES RANKED BY IMPORTANCE

### 1. **HOOKS LAYER (Severity: CRITICAL - 100%)**
Without hooks:
- ✗ Can't access window.openai properly
- ✗ Can't get toolOutput data
- ✗ Can't detect display mode
- ✗ Can't handle state persistence
- ✗ Using wrong API (getToolOutput doesn't exist)

**Fix:** Copy entire app/hooks/ directory from template

### 2. **MCP RESOURCE REGISTRATION (Severity: CRITICAL - 90%)**
Without resources:
- ✗ ChatGPT can't fetch widget HTML
- ✗ MCP outputTemplate has nowhere to point
- ✗ Widget rendering completely broken

**Fix:** Add server.registerResource() calls for each widget type

### 3. **WIDGET PAGE STRUCTURE (Severity: HIGH - 80%)**
Current pages try wrong API:
- ✗ `openai.getToolOutput()` - doesn't exist
- ✗ Should use `openai.toolOutput` property
- ✗ Should use useWidgetProps() hook instead

**Fix:** Rewrite widget pages to use hooks from template

### 4. **MCP RESPONSE HTML WRAPPER (Severity: MEDIUM - 60%)**
Resources should return:
```typescript
text: `<html>${html}</html>`  // Full document
```

Not just:
```typescript
text: html  // Raw content
```

**Fix:** Wrap resource HTML responses in full document tags

### 5. **SDK BOOTSTRAP PARSING (Severity: LOW - 40%)**
Current uses `dangerouslySetInnerHTML` which might:
- ✗ Have escaping issues
- ✗ Not parse IIFE correctly

**Fix:** Test in ChatGPT, may need to switch to inline script

---

## SIDE-BY-SIDE: CRITICAL CODE FLOW

### How Template Works (CORRECT):
```
1. ChatGPT calls MCP tool: create_dashboard
   ↓
2. Tool handler executes:
   return {
     content: [...],
     structuredContent: { title, metrics },
     _meta: {
       "openai/outputTemplate": "ui://widget/dashboard.html",
       "openai/resultCanProduceWidget": true
     }
   }
   ↓
3. ChatGPT sees outputTemplate, fetches resource from MCP server
   GET /mcp?uri=ui://widget/dashboard.html
   ↓
4. MCP server.registerResource() handler:
   Fetches HTML from app/page.tsx and returns:
   {
     contents: [{
       mimeType: "text/html+skybridge",
       text: "<html>...</html>",
       _meta: { ... }
     }]
   }
   ↓
5. ChatGPT renders HTML in iframe
   ↓
6. Next.js hydrates inside iframe:
   - SDK Bootstrap patches APIs
   - Components mount
   - useWidgetProps() hook runs
   - Hook accesses window.openai.toolOutput
   - Gets data from step 2's structuredContent
   - Renders dashboard with data ✅
```

### How Current Implementation Tries (BROKEN):
```
1. ChatGPT calls MCP tool: create_dashboard
   ↓
2. Tool handler executes:
   return {
     content: [...],
     structuredContent: { title, metrics },
     _meta: {
       "openai/outputTemplate": "ui://widget/dashboard.html",
       "openai/resultCanProduceWidget": true
     }
   }
   ↓
3. ChatGPT sees outputTemplate, tries to fetch resource
   BUT: No resources registered! MCP server has no handler!
   ✗ FAILS - 404 or no resource
   ↓
4. Even if ChatGPT tried direct URL /widgets/dashboard:
   - Page loads
   - useEffect runs
   - Tries: window.openai.getToolOutput()
   ✗ FAILS - method doesn't exist!
   ↓
5. Falls back to loading from /api/widgets?id=...
   ✗ But ChatGPT didn't create a widget ID!
   ✗ Falls back to error state ✗
```

---

## EXACT CHANGES NEEDED

### File 1: Create app/hooks/types.ts
Copy from: `/Users/josemichaelhernandezvargas/Desktop/chatgpt-ui-mcp-template/app/hooks/types.ts`

### File 2: Create app/hooks/use-openai-global.ts
Copy from: `/Users/josemichaelhernandezvargas/Desktop/chatgpt-ui-mcp-template/app/hooks/use-openai-global.ts`

### File 3-10: Create remaining hook files
(See template's app/hooks/ directory)

### File 11: Update app/mcp/route.ts
Add server.registerResource() calls matching tool definitions

Example for dashboard:
```typescript
server.registerResource(
  "dashboard-widget",
  "ui://widget/dashboard.html",
  {
    title: "Create Dashboard",
    description: "Display metrics dashboard with KPIs",
    mimeType: "text/html+skybridge",
    _meta: {
      "openai/widgetDescription": "Display metrics dashboard with KPIs",
      "openai/widgetPrefersBorder": true,
    },
  },
  async (uri) => {
    const html = await getWidgetHtml("/widgets/dashboard");
    return {
      contents: [{
        uri: uri.href,
        mimeType: "text/html+skybridge",
        text: `<html>${html}</html>`,  // IMPORTANT: Full HTML wrapper
        _meta: {
          "openai/widgetDescription": "Display metrics dashboard with KPIs",
          "openai/widgetPrefersBorder": true,
          "openai/widgetDomain": baseURL,
        },
      }],
    };
  }
);
```

### File 12: Update app/widgets/dashboard/page.tsx
Replace manual window.openai access with hooks:

```typescript
"use client";
import { useWidgetProps, useDisplayMode, useMaxHeight } from "@/app/hooks";
import Dashboard from "@/components/widgets/Dashboard";

interface DashboardProps {
  title: string;
  metrics: any[];
}

export default function DashboardWidget() {
  const data = useWidgetProps<DashboardProps>();
  const displayMode = useDisplayMode();
  const maxHeight = useMaxHeight();

  // Fallback for direct URL access
  const [localData, setLocalData] = useState(null);
  useEffect(() => {
    if (!data) {
      // Try to load from query param if running outside ChatGPT
      // ...
    }
  }, []);

  return (
    <div style={{ maxHeight, height: displayMode === "fullscreen" ? maxHeight : undefined }}>
      <Dashboard {...(data || localData)} />
    </div>
  );
}
```

### Similar updates for chart.tsx and table.tsx

---

## TESTING CHECKLIST

After making changes:

```bash
# 1. Check hooks are properly imported
grep -r "useWidgetProps" app/widgets/

# 2. Verify MCP resources are registered
curl http://localhost:3000/mcp

# 3. Test individual widget pages
open http://localhost:3000/widgets/dashboard
# Should show: "No widget data available" (expected outside ChatGPT)

# 4. In ChatGPT:
# - Enable developer mode
# - Add MCP: https://your-domain.com/mcp
# - Ask: "Create a dashboard with $100K revenue"
# - Should display inline widget
```

---

## SUMMARY

| Component | Template | Current | Status | Priority |
|-----------|----------|---------|--------|----------|
| Hooks | ✓ 11 files | ✗ None | MISSING | P1-CRITICAL |
| MCP Resources | ✓ Yes | ✗ No | MISSING | P1-CRITICAL |
| Resource Registration | ✓ Yes | ✗ No | MISSING | P1-CRITICAL |
| SDK Bootstrap | ✓ Yes | ✓ Yes | OK | - |
| CORS Middleware | ✓ Yes | ✓ Yes | OK | - |
| Widget Pages | ✓ Use hooks | ✗ Wrong API | BROKEN | P2-HIGH |
| HTML Wrapper | ✓ Full doc | ✗ Partial | MISSING | P3-MEDIUM |
| Asset Prefix | ✗ No | ✓ Yes | BETTER | - |

**Bottom Line:** You have 80% of the infrastructure. You're missing the 20% that makes it actually work with ChatGPT (the hooks).
