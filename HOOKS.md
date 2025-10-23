# 🎣 Custom Hooks Documentation

## Overview

This project includes **25+ professional React hooks** designed for modern, enterprise-grade applications. All hooks are written in TypeScript with full type safety and comprehensive JSDoc documentation.

---

## 📂 Categories

### 🌳 Tree & Data Management Hooks
- `useTreeData` - Manage hierarchical tree data structures
- `useTreeSelection` - Multi-select tree node management
- `useDataPagination` - Advanced pagination with page controls
- `useDataFilter` - Multiple filter predicates support
- `useDataSort` - Multi-column sorting with custom comparators

### 💾 Storage Hooks
- `useLocalStorage` - Persistent state with localStorage
- `useSessionStorage` - Session-based state management

### ⚡ Performance Hooks
- `useDebounce` - Debounce values and prevent excessive re-renders
- `useThrottle` - Throttle function calls with timing control
- `useAnimationFrame` - RequestAnimationFrame hook for smooth animations
- `useCountAnimation` - Smooth number counter animations

### 🛠️ Utility Hooks
- `useMediaQuery` - Responsive design with CSS media queries
- `useBreakpoints` - Pre-configured breakpoints (mobile, tablet, desktop)
- `useIntersectionObserver` - Lazy loading and scroll tracking
- `useClipboard` - Copy to clipboard with status feedback
- `useKeyboardShortcut` - Register keyboard shortcuts
- `useKeyboardShortcuts` - Multiple shortcuts management
- `useAsyncState` - Async operations with loading/error states
- `useDragAndDrop` - Drag and drop functionality
- `useDraggable` - Make elements draggable

### 🤖 OpenAI Integration Hooks
- `useCallTool` - Call ChatGPT tools
- `useSendMessage` - Send messages to ChatGPT
- `useOpenExternal` - Open external links in ChatGPT
- `useDisplayMode` - Get widget display mode
- `useWidgetProps` - Get widget props from ChatGPT
- `useWidgetState` - Manage widget state
- `useMaxHeight` - Get maximum widget height

---

## 📖 Detailed Documentation

### 🌳 useTreeData

Manage hierarchical tree data with full CRUD operations.

**Features:**
- Add/remove/update nodes
- Find nodes by ID
- Toggle expansion
- Expand/collapse all nodes
- Nested children support

**Usage:**
```tsx
import { useTreeData } from "@/app/hooks";

function FileExplorer() {
  const {
    tree,
    addNode,
    removeNode,
    updateNode,
    toggleExpansion,
    expandAll,
    collapseAll,
  } = useTreeData([
    {
      id: "1",
      label: "src",
      children: [
        { id: "1-1", label: "components" },
        { id: "1-2", label: "hooks" },
      ],
    },
  ]);

  return (
    <div>
      {tree.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
      <button onClick={expandAll}>Expand All</button>
    </div>
  );
}
```

---

### 🎯 useTreeSelection

Multi-select management for tree nodes.

**Features:**
- Single or multi-select mode
- Select/deselect nodes
- Toggle selection
- Check if node is selected
- Select all nodes

**Usage:**
```tsx
import { useTreeSelection } from "@/app/hooks";

function SelectableTree() {
  const { selected, toggle, isSelected, clear } = useTreeSelection([], true);

  return (
    <div>
      <button onClick={() => toggle("node-1")}>
        {isSelected("node-1") ? "Deselect" : "Select"}
      </button>
      <p>Selected: {selected.join(", ")}</p>
      <button onClick={clear}>Clear All</button>
    </div>
  );
}
```

---

### 📄 useDataPagination

Advanced pagination with navigation controls.

**Features:**
- Configurable items per page
- Page navigation (next, prev, first, last)
- Current page tracking
- Total pages calculation
- Page numbers for UI

**Usage:**
```tsx
import { useDataPagination } from "@/app/hooks";

function PaginatedList({ items }) {
  const {
    currentData,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage,
    hasPrevPage,
  } = useDataPagination(items, 10);

  return (
    <div>
      {currentData.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
      <div>
        <button disabled={!hasPrevPage} onClick={prevPage}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button disabled={!hasNextPage} onClick={nextPage}>
          Next
        </button>
      </div>
    </div>
  );
}
```

---

### 🔍 useDataFilter

Multiple filter predicates with easy management.

**Features:**
- Named filters
- Add/remove/update filters
- Clear all filters
- Check filter existence
- Automatic data filtering

**Usage:**
```tsx
import { useDataFilter } from "@/app/hooks";

function FilteredUsers({ users }) {
  const { filteredData, addFilter, removeFilter, clearFilters } =
    useDataFilter(users);

  const handleSearch = (term: string) => {
    if (term) {
      addFilter("search", (user) =>
        user.name.toLowerCase().includes(term.toLowerCase())
      );
    } else {
      removeFilter("search");
    }
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      <button onClick={() => addFilter("active", (user) => user.isActive)}>
        Active Only
      </button>
      {filteredData.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

---

### 🔄 useDataSort

Multi-column sorting with direction control.

**Features:**
- Sort by key or custom function
- Ascending/descending/null states
- Toggle sort direction
- String/number/custom comparators
- Custom sort functions

**Usage:**
```tsx
import { useDataSort } from "@/app/hooks";

function SortableTable({ data }) {
  const { sortedData, sortKey, sortDirection, toggleSort } = useDataSort(data);

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => toggleSort("name")}>
            Name {sortKey === "name" && sortDirection}
          </th>
          <th onClick={() => toggleSort("age")}>
            Age {sortKey === "age" && sortDirection}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.age}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

### 💾 useLocalStorage

Sync React state with localStorage automatically.

**Features:**
- Automatic serialization/deserialization
- SSR safe
- Cross-tab synchronization
- Type-safe
- Clear/remove functionality

**Usage:**
```tsx
import { useLocalStorage } from "@/app/hooks";

function UserPreferences() {
  const [theme, setTheme, removeTheme] = useLocalStorage("theme", "light");

  return (
    <div>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
      <button onClick={() => setTheme("light")}>Light Mode</button>
      <button onClick={removeTheme}>Reset</button>
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

---

### ⏱️ useDebounce

Debounce values to reduce re-renders and API calls.

**Features:**
- Configurable delay
- TypeScript generic support
- Automatic cleanup

**Usage:**
```tsx
import { useDebounce } from "@/app/hooks";

function SearchInput() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // API call with debounced value
    fetchResults(debouncedSearch);
  }, [debouncedSearch]);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

---

### 🎯 useThrottle

Throttle function calls to limit execution frequency.

**Features:**
- Configurable interval
- Leading and trailing edge support
- Automatic cleanup

**Usage:**
```tsx
import { useThrottle } from "@/app/hooks";

function ScrollTracker() {
  const handleScroll = useThrottle(() => {
    console.log("Scroll position:", window.scrollY);
  }, 200);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return <div>Scroll to see throttled output</div>;
}
```

---

### 📱 useMediaQuery

Responsive design with CSS media queries.

**Features:**
- Real-time query matching
- SSR safe
- TypeScript support
- Custom breakpoints

**Usage:**
```tsx
import { useMediaQuery, useBreakpoints } from "@/app/hooks";

function ResponsiveLayout() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const { isMobile, isTablet, isDesktop } = useBreakpoints();

  return (
    <div>
      {isMobile ? <MobileNav /> : <DesktopNav />}
      {isDark && <p>Dark mode detected</p>}
    </div>
  );
}
```

---

### 👁️ useIntersectionObserver

Lazy loading and visibility tracking.

**Features:**
- Configurable threshold
- Root and rootMargin support
- Freeze once visible option
- Entry data access

**Usage:**
```tsx
import { useIntersectionObserver } from "@/app/hooks";

function LazyImage({ src }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    freezeOnceVisible: true,
  });

  return (
    <div ref={ref}>
      {isIntersecting && <img src={src} alt="Lazy loaded" />}
    </div>
  );
}
```

---

### 📋 useClipboard

Copy to clipboard with status feedback.

**Features:**
- Plain text and HTML support
- Success/error states
- Auto-reset timeout
- TypeScript support

**Usage:**
```tsx
import { useClipboard } from "@/app/hooks";

function CopyButton({ text }) {
  const { copy, copied, error } = useClipboard(2000);

  return (
    <button onClick={() => copy(text)}>
      {copied ? "Copied!" : "Copy"}
      {error && <span>Error: {error.message}</span>}
    </button>
  );
}
```

---

### ⌨️ useKeyboardShortcut

Register keyboard shortcuts with modifiers.

**Features:**
- Ctrl, Shift, Alt, Meta modifiers
- Prevent default option
- Enable/disable control
- Multiple shortcuts support

**Usage:**
```tsx
import { useKeyboardShortcut, formatShortcut } from "@/app/hooks";

function Editor() {
  useKeyboardShortcut(
    { key: "s", ctrl: true, meta: true, preventDefault: true },
    () => handleSave()
  );

  useKeyboardShortcut({ key: "Escape" }, () => handleClose());

  return <div>Press {formatShortcut({ key: "s", ctrl: true })} to save</div>;
}
```

---

### 🔄 useAsyncState

Manage async operations with loading/error states.

**Features:**
- Loading state tracking
- Error handling
- Data caching
- Reset functionality
- TypeScript generics

**Usage:**
```tsx
import { useAsyncState } from "@/app/hooks";

function UserProfile({ userId }) {
  const { data, loading, error, execute } = useAsyncState(
    async (id: string) => {
      const response = await fetch(`/api/users/${id}`);
      return response.json();
    }
  );

  return (
    <div>
      <button onClick={() => execute(userId)}>Load User</button>
      {loading && <Spinner />}
      {error && <Error message={error.message} />}
      {data && <Profile user={data} />}
    </div>
  );
}
```

---

### 🎨 useAnimationFrame

Request animation frame for smooth animations.

**Features:**
- Delta time calculation
- Enable/disable control
- Automatic cleanup
- Performance optimized

**Usage:**
```tsx
import { useAnimationFrame, useCountAnimation } from "@/app/hooks";

function SmoothCounter() {
  const count = useCountAnimation(1000, 2000); // Animate to 1000 over 2s

  return <div>{Math.round(count)}</div>;
}

function CustomAnimation() {
  const [position, setPosition] = useState(0);

  useAnimationFrame((deltaTime) => {
    setPosition((prev) => prev + deltaTime * 0.1);
  });

  return <div style={{ transform: `translateX(${position}px)` }} />;
}
```

---

### 🎭 useDragAndDrop

Drag and drop functionality with visual feedback.

**Features:**
- File and data support
- Visual feedback (isDragging)
- Event callbacks
- Drag counter tracking

**Usage:**
```tsx
import { useDragAndDrop, useDraggable } from "@/app/hooks";

function DropZone() {
  const { isDragging, dragHandlers } = useDragAndDrop({
    onDrop: (files) => {
      console.log("Dropped files:", files);
    },
  });

  return (
    <div
      {...dragHandlers}
      className={isDragging ? "border-blue-500" : "border-gray-300"}
    >
      Drop files here
    </div>
  );
}

function DraggableItem({ data }) {
  const draggableProps = useDraggable({ id: "item-1", data });
  return <div {...draggableProps}>Drag me</div>;
}
```

---

## 🎨 Tree Widget Variants

The Tree widget supports 4 premium variants:

### 1. **Default** - Clean and professional
- Blue/purple gradients
- Simple borders
- Standard hover effects

### 2. **Premium** - Luxury dark theme
- Dark slate/purple background
- Gold/amber accents
- Glowing shadows
- Premium feel

### 3. **Minimal** - Clean and simple
- White background
- Gray tones
- Minimal effects

### 4. **Neon** - Cyberpunk aesthetic
- Black/purple background
- Cyan/pink/purple gradients
- Neon glow effects
- Futuristic design

**Usage:**
```tsx
<Tree
  title="File System"
  variant="premium" // or "default" | "minimal" | "neon"
  showSearch={true}
  multiSelect={true}
  expandAll={false}
  data={treeData}
/>
```

---

## 🚀 Performance Tips

1. **Use memoization** - Wrap expensive computations in `useMemo`
2. **Debounce searches** - Use `useDebounce` for search inputs
3. **Throttle scroll handlers** - Use `useThrottle` for scroll events
4. **Lazy load images** - Use `useIntersectionObserver` for images
5. **Paginate large datasets** - Use `useDataPagination` for 100+ items
6. **Filter before sorting** - Apply filters first, then sort

---

## 📦 TypeScript Support

All hooks are fully typed with TypeScript generics:

```tsx
// Tree nodes with custom data
const { tree } = useTreeData<{ size: number }>([...]);

// Async state with typed response
const { data } = useAsyncState<User, [string]>(fetchUser);

// Filter with typed items
const { filteredData } = useDataFilter<Product>(products);
```

---

## 🎯 Best Practices

1. **Always provide default values** for hooks with initial state
2. **Use TypeScript generics** for type safety
3. **Memoize callbacks** passed to hooks
4. **Clean up effects** in useEffect returns
5. **Test hooks** with React Testing Library
6. **Document custom hooks** with JSDoc

---

## 📚 Additional Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🤝 Contributing

Feel free to add new hooks following the existing patterns:

1. Create hook file in `/app/hooks/`
2. Add JSDoc documentation
3. Export from `/app/hooks/index.ts`
4. Add examples to this documentation
5. Test thoroughly

---

**Built with ❤️ using Next.js 16, React 19, and TypeScript**
