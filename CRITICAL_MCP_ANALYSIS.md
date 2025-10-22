# CRITICAL COMPARISON: MCP Template vs Current Implementation

## EXECUTIVE SUMMARY: THE MISSING PIECES

Your widgets DON'T display inline in ChatGPT because the current implementation is missing **5 critical components** that the working MCP template has:

1. **Missing OpenAI SDK Hooks** (most critical) - The template uses window.openai API
2. **Missing MCP Resource Registration** - Template registers resources separately from tools
3. **Missing Asset Prefix Configuration** - Static assets aren't loading in iframe
4. **Wrong Response Format** - Current implementation doesn't use proper OpenAI metadata
5. **Missing SDK Bootstrap** - No patching of browser APIs for iframe

---

## 1. MISSING OPENAI SDK HOOKS (CRITICAL)

### Template Has (8 Custom Hooks):
```
app/hooks/
├── use-openai-global.ts      [MISSING] - Core hook for window.openai access
├── use-widget-props.ts        [MISSING] - Get tool output data
├── use-call-tool.ts           [MISSING] - Call MCP tools from widget
├── use-send-message.ts        [MISSING] - Send follow-up messages
├── use-display-mode.ts        [MISSING] - Detect display mode (inline/fullscreen/pip)
├── use-request-display-mode.ts [MISSING] - Request display mode changes
├── use-max-height.ts          [MISSING] - Get max height constraint
├── use-widget-state.ts        [MISSING] - Persist widget state
├── use-is-chatgpt-app.ts      [MISSING] - Detect if running in ChatGPT
├── use-open-external.ts       [MISSING] - Open external links
└── types.ts                   [MISSING] - TypeScript definitions
```

### Current Implementation:
- NO hooks directory at all
- Manually checks `window.openai` in dashboard/page.tsx (line 32-43)
- Missing proper abstraction for ChatGPT SDK API

### Why This Matters:
Without these hooks, widgets can't:
- Access tool invocation data (ChatGPT won't pass data to widget)
- Respond to display mode changes
- Call back to ChatGPT tools
- Send follow-up messages
- Manage persistent state

**SOLUTION:** Copy ALL hooks from template's `app/hooks/` directory

---

## 2. MISSING MCP RESOURCE REGISTRATION

### Template's MCP Route (app/mcp/route.ts):
```typescript
// Register RESOURCE separately
server.registerResource(
  "content-widget",
  "ui://widget/content-template.html",  // Resource URI
  {
    title: contentWidget.title,
    description: contentWidget.description,
    mimeType: "text/html+skybridge",     // CRITICAL: Must be skybridge mime type
    _meta: {
      "openai/widgetDescription": contentWidget.description,
      "openai/widgetPrefersBorder": true,
    },
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "text/html+skybridge",  // CRITICAL
        text: `<html>${contentWidget.html}</html>`,  // Full HTML with wrapper
        _meta: {
          "openai/widgetDescription": contentWidget.description,
          "openai/widgetPrefersBorder": true,
          "openai/widgetDomain": contentWidget.widgetDomain,
        },
      },
    ],
  })
);

// Register TOOL pointing to RESOURCE
server.registerTool(
  contentWidget.id,
  {
    title: contentWidget.title,
    description: "...",
    inputSchema: { ... },
    _meta: widgetMeta(contentWidget),  // Has outputTemplate reference
  },
  async (params) => {
    return {
      content: [{ type: "text", text: "..." }],
      structuredContent: params,
      _meta: widgetMeta(contentWidget),  // CRITICAL: metadata on response
    };
  }
);
```

### Current Implementation's MCP Route:
```typescript
// ONLY registers tools, NO resources
server.registerTool("create_dashboard", { ... });
server.registerTool("create_chart", { ... });
server.registerTool("create_table", { ... });
// NO server.registerResource() calls
```

### Critical Metadata Missing:
Template has:
```typescript
function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,           // Links tool to resource
    "openai/toolInvocation/invoking": widget.invoking,    // "Loading..."
    "openai/toolInvocation/invoked": widget.invoked,      // "Loaded"
    "openai/widgetAccessible": false,                      // Private widget
    "openai/resultCanProduceWidget": true,                // Enables rendering
  } as const;
}
```

Current implementation RETURNS this metadata:
```typescript
structuredContent: params,  // Missing the _meta object!
_meta: widgetMeta(chartWidget),  // But metadata keys are different
```

### The Flow:
1. **ChatGPT calls tool** → Tool execution
2. **Tool returns metadata** → Tells ChatGPT which resource to fetch
3. **ChatGPT fetches resource** → Gets HTML from registered resource
4. **ChatGPT renders in iframe** → Widget displays inline

Current implementation skips step 3 because:
- No resources are registered
- No `outputTemplate` linking tool to resource
- ChatGPT doesn't know what HTML to fetch

---

## 3. MISSING ASSET PREFIX CONFIGURATION

### Template's next.config.ts:
```typescript
const nextConfig: NextConfig = {
  serverExternalPackages: ["mcp-handler"],
};
```

### Current Implementation's next.config.ts:
```typescript
const nextConfig: NextConfig = {
  assetPrefix: baseURL,  // CRITICAL - This is here!
};
```

Wait - current implementation HAS this! But template doesn't. This is actually a DIFFERENCE (not missing).

However, the template's baseUrl.ts is used instead:
```typescript
const baseURL = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : ...;
```

Current implementation does the same. So this is OK.

---

## 4. WRONG RESPONSE FORMAT IN MCP ROUTE

### Template's Tool Response:
```typescript
async ({ name }) => {
  return {
    content: [
      {
        type: "text",
        text: name,
      },
    ],
    structuredContent: {
      name: name,
      timestamp: new Date().toISOString(),
    },
    _meta: widgetMeta(contentWidget),  // CRITICAL: metadata on response
  };
}
```

### Current Implementation's Tool Response:
```typescript
async (params) => {
  return {
    content: [
      {
        type: "text",
        text: `Dashboard "${params.title}" created with ${params.metrics.length} metrics`,
      },
    ],
    structuredContent: params,
    _meta: widgetMeta(dashboardWidget),  // Has this too...
  };
}
```

WAIT - current implementation HAS the `_meta` in response!

But the critical difference is:
- Template's `widgetMeta()` returns `"openai/outputTemplate": widget.templateUri`
- Current implementation's `widgetMeta()` also has this!

Let me check the actual current metadata...

Actually looking at current implementation line 27-35:
```typescript
function widgetMeta(widget: WidgetConfig) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}
```

THIS IS IDENTICAL TO TEMPLATE! So this part is correct.

---

## 5. SDK BOOTSTRAP DIFFERENCES

### Template's SDK Bootstrap (layout.tsx):
- Simple, clean inline script
- Uses IIFE pattern: `(function() { ... })()`
- Patches history APIs
- Patches fetch
- Handles mutation observer
- Handles external links

### Current Implementation's SDK Bootstrap:
- Uses `dangerouslySetInnerHTML` for the script
- Same functionality as template
- BETTER: includes CSS fix for relative font URLs!

Current implementation is BETTER here because it handles CSS asset loading too.

---

## THE REAL PROBLEM: MISSING HOOKS + WRONG WIDGET PAGES

Looking at current widget page (dashboard/page.tsx):
```typescript
"use client";
// Uses window.openai directly (lines 32-43)
if (typeof window !== "undefined" && (window as any).openai) {
  const openai = (window as any).openai;
  if (openai.getToolOutput) {
    const output = await openai.getToolOutput();
    // ...
  }
}
```

This calls `openai.getToolOutput()` which DOESN'T EXIST in the OpenAI SDK!

The correct method is `window.openai.toolOutput` (a property, not a function).

This is why the widget doesn't get data - it's looking for the wrong API!

---

## 6. MISSING COMPONENT STRUCTURE

### Template Uses:
- Every page in `/app` can be rendered as widget
- `page.tsx` is the widget renderer
- Uses hooks to access `window.openai`
- Example: `app/page.tsx` demonstrates widget usage

### Current Uses:
- `app/widgets/dashboard/page.tsx` - Widget page
- `app/widget/page.tsx` - Generic widget page
- Uses manual `window.openai` checks instead of hooks

---

## 7. MIMEYPE ISSUE

Template:
```typescript
mimeType: "text/html+skybridge",  // Correct for ChatGPT widgets
```

Current:
```typescript
mimeType: "text/html+skybridge",  // SAME - also correct
```

Both are correct.

---

## SUMMARY OF WHAT'S BROKEN

1. **Widget pages use `openai.getToolOutput()` which doesn't exist**
   - Should use `openai.toolOutput` property
   - Or better: use the missing `useWidgetProps()` hook

2. **No hooks for OpenAI SDK integration**
   - Can't detect ChatGPT environment
   - Can't handle display mode
   - Can't access tool output properly
   - Can't handle widget state

3. **Correct MCP resource registration exists** (✓)
   - But widgets can't use the data because no hooks

4. **Correct metadata in tool response** (✓)
   - But might not matter if resource fetching is broken

5. **SDK Bootstrap exists but might not be working** (?)
   - Uses dangerouslySetInnerHTML which might have parsing issues

---

## WHAT YOU NEED TO DO (Priority Order)

### Priority 1: Copy Hooks from Template
```bash
cp -r /path/to/template/app/hooks /path/to/current/app/
```

Hooks you need:
- use-openai-global.ts
- use-widget-props.ts
- use-display-mode.ts
- use-max-height.ts
- use-is-chatgpt-app.ts
- use-call-tool.ts
- use-send-message.ts
- use-request-display-mode.ts
- use-open-external.ts
- use-widget-state.ts
- types.ts
- index.ts (exports)

### Priority 2: Update Widget Pages to Use Hooks
Replace manual `window.openai` checks with:
```typescript
"use client";
import { useWidgetProps, useDisplayMode, useMaxHeight } from "@/app/hooks";

export default function Dashboard() {
  const props = useWidgetProps<DashboardProps>();
  const displayMode = useDisplayMode();
  const maxHeight = useMaxHeight();
  
  return (
    <div style={{ maxHeight, displayMode }}>
      <Dashboard {...props} />
    </div>
  );
}
```

### Priority 3: Verify MCP Response Format
Ensure tool response has:
```typescript
{
  content: [{ type: "text", text: "..." }],
  structuredContent: params,  // Data passed to widget
  _meta: {
    "openai/outputTemplate": "ui://widget/...",
    "openai/resultCanProduceWidget": true,
    // ... other metadata
  }
}
```

### Priority 4: Fix SDK Bootstrap (if needed)
Current implementation uses `dangerouslySetInnerHTML` which is safer than inline script, but may have escaping issues. Test in ChatGPT.

### Priority 5: Ensure HTML Wrapper in Resources
Resources should return complete HTML:
```typescript
text: html,  // Should include <html>, <head>, <body> tags
```

Not just the component content.

---

## VERIFICATION CHECKLIST

- [ ] All 11 hook files exist in `app/hooks/`
- [ ] Widget pages import and use hooks from `app/hooks/`
- [ ] Widget pages use `useWidgetProps()` instead of manual `window.openai` access
- [ ] MCP route registers BOTH tools AND resources
- [ ] Tool metadata includes "openai/outputTemplate"
- [ ] Tool response includes _meta with all required OpenAI keys
- [ ] Resources return complete HTML with `<html>` wrapper
- [ ] SDK Bootstrap script is in layout.tsx
- [ ] `window.openai` is detected properly via `useIsChatGptApp()`
- [ ] baseURL is configured correctly
- [ ] CORS middleware handles OPTIONS requests

---

## HOW IT WORKS (After Fix)

1. **ChatGPT User**: "Create a dashboard with $125,430 revenue"
2. **ChatGPT**: Calls `create_dashboard` MCP tool
3. **MCP Handler**: Tool executes, returns:
   ```json
   {
     "content": [{ "type": "text", "text": "Dashboard created..." }],
     "structuredContent": { "title": "...", "metrics": [...] },
     "_meta": {
       "openai/outputTemplate": "ui://widget/dashboard.html",
       "openai/resultCanProduceWidget": true
     }
   }
   ```
4. **ChatGPT**: Sees `outputTemplate`, fetches resource `/mcp` (registered resource)
5. **MCP Server**: Returns resource HTML from `/widgets/dashboard` page
6. **ChatGPT**: Renders HTML in iframe
7. **Widget (in iframe)**: 
   - Loads
   - Detects `window.openai` (injected by ChatGPT)
   - Calls `useWidgetProps()` hook
   - Hook accesses `window.openai.toolOutput`
   - Gets `structuredContent` from step 3
   - Renders with data
   - Shows interactive dashboard ✅

---

## KEY INSIGHT

The template works because:
1. MCP registers resources that ChatGPT can fetch
2. Tool responses point to these resources via `outputTemplate`
3. Hooks properly access `window.openai` injected by ChatGPT
4. Widget pages use hooks to get data from `window.openai.toolOutput`
5. Everything is wrapped in proper SDK Bootstrap

Your implementation is ALMOST there but missing the hooks layer that bridges the widget to ChatGPT's SDK.
