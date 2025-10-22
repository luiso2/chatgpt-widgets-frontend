# WHY YOUR WIDGETS DON'T DISPLAY IN CHATGPT

## The Quick Answer

Your widgets don't display inline in ChatGPT because:

1. **Missing Hooks** - You have NO `app/hooks/` directory. The template has 11 hook files.
2. **Missing Resource Registration** - Your MCP server only registers TOOLS, not RESOURCES.
3. **Wrong Widget Page Code** - Pages try to call `window.openai.getToolOutput()` which doesn't exist.

Without these, ChatGPT can't:
- Fetch the widget HTML
- Pass data to the widget
- Know what to display in the iframe

---

## The Data Flow (What Should Happen)

```
ChatGPT User: "Create a dashboard with $125K revenue"
    ↓
ChatGPT: Calls "create_dashboard" MCP tool
    ↓
Your MCP Server: Executes tool handler
    Returns: {
      structuredContent: { title: "...", metrics: [...] },
      _meta: { "openai/outputTemplate": "ui://widget/dashboard.html" }
    }
    ↓
ChatGPT: Sees outputTemplate, fetches the resource
    GET /mcp?uri=ui://widget/dashboard.html
    ↓
Your Server: Resource handler returns complete HTML
    (This is where you have NOTHING - no registerResource call!)
    ↓
ChatGPT: Takes HTML, renders in iframe with window.openai injected
    ↓
Widget (in iframe): Loads and runs
    Calls useWidgetProps() hook
    Hook reads window.openai.toolOutput
    Gets data from MCP response
    Renders dashboard with data
    ✅ USER SEES INTERACTIVE DASHBOARD IN CHAT
```

---

## What's Actually Happening (Why It Fails)

```
ChatGPT User: "Create a dashboard with $125K revenue"
    ↓
ChatGPT: Calls "create_dashboard" MCP tool
    ↓
Your MCP Server: Executes tool handler
    Returns metadata with outputTemplate
    ↓
ChatGPT: Tries to fetch resource
    Sends: GET /mcp?uri=ui://widget/dashboard.html
    ↓
Your MCP Server: Has NO resource handler!
    No server.registerResource() call exists
    Returns: ??? (404 or error)
    ✗ FAILS
    ↓
Even if widget loads manually:
    Widget page loads at /widgets/dashboard
    useEffect runs
    Code tries: window.openai.getToolOutput()
    ✗ FAILS - This method doesn't exist!
    ↓
Page shows error: "Widget not found" or "Unable to load widget data"
    ✗ USER SEES NOTHING OR ERROR
```

---

## The Three Critical Missing Pieces

### 1. Hooks Directory (app/hooks/)

**Template has:**
```
app/hooks/
├── types.ts                    - Defines window.openai interface
├── use-openai-global.ts        - Accesses window.openai properties
├── use-widget-props.ts         - Gets tool output data ✨ CRITICAL
├── use-display-mode.ts         - Detects display mode (inline/fullscreen)
├── use-max-height.ts           - Gets max height constraint
├── use-widget-state.ts         - Manages persistent widget state
├── use-is-chatgpt-app.ts       - Detects ChatGPT environment
├── use-call-tool.ts            - Calls MCP tools from widget
├── use-send-message.ts         - Sends follow-up messages
├── use-request-display-mode.ts - Requests display mode changes
├── use-open-external.ts        - Opens external links
└── index.ts                    - Exports all hooks
```

**Your implementation has:**
```
✗ NO app/hooks/ directory
✗ Manual window.openai access scattered in components
✗ Wrong API calls (getToolOutput doesn't exist)
```

**Why it matters:**
The hooks are how your React components talk to ChatGPT's injected `window.openai` API. Without them, you can't:
- Get the data ChatGPT passed to you
- Detect if you're running in ChatGPT
- Handle display modes
- Persist widget state
- Respond to ChatGPT events

### 2. MCP Resource Registration

**Template code:**
```typescript
server.registerResource(
  "dashboard-widget",                     // Resource ID
  "ui://widget/dashboard.html",           // Resource URI
  { mimeType: "text/html+skybridge", ... }, // Resource metadata
  async (uri) => {                        // Resource handler
    const html = await getWidgetHtml("/widgets/dashboard");
    return {
      contents: [{
        uri: uri.href,
        mimeType: "text/html+skybridge",
        text: `<html>${html}</html>`,     // Full HTML document
        _meta: { ... }
      }]
    };
  }
);
```

**Your implementation:**
```typescript
// ✗ No server.registerResource() calls at all
// ✗ Only has server.registerTool() calls
// ✗ Widgets served via /widgets/* pages + /api/widgets REST endpoint
// ✗ But MCP server has nowhere to point when ChatGPT asks for the resource
```

**Why it matters:**
When ChatGPT gets the tool response with `"openai/outputTemplate": "ui://widget/dashboard.html"`, it tries to fetch that resource from your MCP server. If you don't register a resource, ChatGPT gets a 404 and can't render anything.

### 3. Correct Widget Page Implementation

**Template pattern:**
```typescript
"use client";
import { useWidgetProps, useDisplayMode, useMaxHeight } from "@/app/hooks";

export default function Widget() {
  const props = useWidgetProps();          // ✨ Gets data from window.openai.toolOutput
  const displayMode = useDisplayMode();    // Gets "inline" | "fullscreen" | "pip"
  const maxHeight = useMaxHeight();        // Gets height constraint
  
  return (
    <div style={{ maxHeight }}>
      <YourComponent {...props} />
    </div>
  );
}
```

**Your pattern:**
```typescript
"use client";
// Manual check:
if (typeof window !== "undefined" && window.openai) {
  const openai = window.openai;
  if (openai.getToolOutput) {             // ✗ Doesn't exist!
    const output = await openai.getToolOutput();  // ✗ Wrong API
  }
}
```

**Why it's broken:**
1. `window.openai.getToolOutput()` doesn't exist
2. `window.openai.toolOutput` is the correct property (not a function)
3. Shouldn't be in useEffect with async/await pattern
4. Should use React hooks instead for proper lifecycle management

---

## Line-by-Line: What's Wrong in dashboard/page.tsx

```typescript
// Line 32-43 is BROKEN:
if (typeof window !== "undefined" && (window as any).openai) {
  const openai = (window as any).openai;
  if (openai.getToolOutput) {             // ✗ This method doesn't exist
    const output = await openai.getToolOutput();  // ✗ Wrong API
    const structuredContent = output?.result?.structuredContent;  // ✗ Wrong path
    if (structuredContent) {
      setData(structuredContent);
      setLoading(false);
      return;
    }
  }
}
```

**Correct way:**
```typescript
// Using the hook from template:
const data = useWidgetProps<DashboardProps>();

// The hook does this internally:
// const toolOutput = useSyncExternalStore(...);
// return toolOutput from window.openai.toolOutput;

// window.openai structure (injected by ChatGPT):
// {
//   toolOutput: { ... },        // The tool output object
//   displayMode: "inline",      // Current display mode
//   maxHeight: 500,             // Height constraint
//   toolInput: { ... },         // Original tool input
//   ...                         // Other properties
// }
```

---

## The Window.openai Object (ChatGPT Injects)

When ChatGPT renders your widget in an iframe, it injects a `window.openai` object with this structure:

```typescript
window.openai = {
  // STATE (read-only, updates trigger events)
  theme: "light" | "dark",
  displayMode: "inline" | "fullscreen" | "pip",
  maxHeight: 500,                    // Height constraint in pixels
  
  toolInput: { ... },                // The parameters passed to the tool
  toolOutput: { ... },               // The data returned by tool ✨ THIS IS WHAT YOU NEED
  toolResponseMetadata: { ... },     // Metadata from tool response
  
  // METHODS (for widgets to communicate back)
  callTool(name: string, args: object) {},           // Call another tool
  sendFollowUpMessage({ prompt: string }) {},        // Send message to ChatGPT
  requestDisplayMode({ mode: string }) {},           // Request display mode
  openExternal({ href: string }) {},                 // Open external link
  setWidgetState(state: object) {},                  // Persist widget state
};
```

Your code tries to call methods that don't exist. The hooks properly access these properties.

---

## Exact Files Missing

### From Template's app/hooks/ Directory:

```
1. types.ts (120 lines)
   - Defines OpenAIGlobals interface
   - Defines window.openai types
   - SET_GLOBALS_EVENT_TYPE constant

2. use-openai-global.ts (54 lines)
   - Core hook that subscribes to window.openai changes
   - Uses useSyncExternalStore for reactivity
   - All other hooks depend on this!

3. use-widget-props.ts (30 lines)
   - Gets window.openai.toolOutput
   - Returns the data from tool invocation

4. use-display-mode.ts (24 lines)
   - Gets current display mode
   - Returns "inline" | "fullscreen" | "pip"

5. use-max-height.ts (22 lines)
   - Gets max height constraint
   - Returns number or null

6. use-widget-state.ts (72 lines)
   - Manages persistent state
   - Like useState but syncs with ChatGPT parent

7. use-is-chatgpt-app.ts (20 lines)
   - Detects if running in ChatGPT
   - Checks for window.openai presence

8. use-call-tool.ts (36 lines)
   - Calls MCP tools from widget
   - Communicates back to ChatGPT

9. use-send-message.ts (27 lines)
   - Sends follow-up messages
   - Continues conversation in ChatGPT

10. use-request-display-mode.ts (30 lines)
    - Requests fullscreen or other modes
    - ChatGPT may approve or deny

11. use-open-external.ts (43 lines)
    - Opens external links properly
    - Uses ChatGPT's native handler if available

12. index.ts (19 lines)
    - Exports all hooks
```

**Total: ~500 lines of code you need to copy**

---

## How to Fix (Quick Start)

### Step 1: Copy all hooks from template
```bash
mkdir -p app/hooks
cp /path/to/template/app/hooks/* app/hooks/
```

### Step 2: Update app/mcp/route.ts
Add `server.registerResource()` for each widget type right before `server.registerTool()`:

```typescript
const handler = createMcpHandler(async (server) => {
  // Dashboard
  server.registerResource(
    "dashboard-widget",
    "ui://widget/dashboard.html",
    { title: "Dashboard", mimeType: "text/html+skybridge", _meta: {...} },
    async (uri) => {
      const html = await getWidgetHtml("/widgets/dashboard");
      return {
        contents: [{
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${html}</html>`,
          _meta: { "openai/widgetDomain": baseURL }
        }]
      };
    }
  );
  
  // Then your existing tool registration
  server.registerTool("create_dashboard", ...);
  
  // Chart, Table, etc. - same pattern
});
```

### Step 3: Update widget pages
```typescript
"use client";
import { useWidgetProps, useDisplayMode, useMaxHeight } from "@/app/hooks";

interface Props { title: string; metrics: any[] }

export default function Dashboard() {
  const props = useWidgetProps<Props>();
  const displayMode = useDisplayMode();
  const maxHeight = useMaxHeight();

  if (!props) return <div>No data</div>;
  
  return (
    <div style={{ maxHeight }}>
      <DashboardComponent {...props} />
    </div>
  );
}
```

### Step 4: Test
1. In ChatGPT: Add MCP server URL
2. Ask: "Create a dashboard with $100K revenue"
3. Should display inline widget ✅

---

## Why Template Works and Yours Doesn't

| Aspect | Template | Your Code | Result |
|--------|----------|-----------|--------|
| **Hooks** | 11 files with window.openai integration | 0 files | Can't access ChatGPT data |
| **Resource Registration** | YES - server.registerResource() | NO - only server.registerTool() | ChatGPT can't fetch HTML |
| **Widget Pages** | Use useWidgetProps() hook | Manual window.openai access | Wrong API calls fail |
| **HTML Structure** | Returns `<html>${html}</html>` | Returns raw HTML | May render incorrectly |
| **Response Metadata** | Complete _meta with all OpenAI keys | Has _meta but incomplete | May not tell ChatGPT to render |

**The core issue:** Your infrastructure (MCP, tools, metadata) is 95% correct. You're just missing the hook layer that makes React components work with ChatGPT's injected window.openai object.

---

## Verification

After implementing the fix, verify:

```bash
# 1. Check hooks exist
ls -la app/hooks/use-widget-props.ts  # Should exist

# 2. Check imports work
grep "useWidgetProps" app/widgets/dashboard/page.tsx  # Should find it

# 3. Test resource registration
curl http://localhost:3000/mcp  # Should show registered resources

# 4. In ChatGPT (with developer mode):
# Ask: "Create a dashboard"
# Should display inline ✅
```

---

## Key Files to Review

1. **Template's app/hooks/types.ts** - Understand the window.openai interface
2. **Template's app/hooks/use-openai-global.ts** - Core hook implementation
3. **Template's app/page.tsx** - How a proper widget page looks
4. **Current app/mcp/route.ts** - You need to add registerResource calls here
5. **Current app/widgets/dashboard/page.tsx** - Needs rewrite to use hooks

---

## The One Sentence Explanation

Your MCP server tells ChatGPT "the widget is at ui://widget/dashboard.html" but provides no way for ChatGPT to actually fetch that HTML, and your widget pages have no way to receive the data ChatGPT passes to them.

The hooks and resource registration fix both problems.
