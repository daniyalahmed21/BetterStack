# Integrating Search Functionality

I've created reusable components for search and notifications. Here's how to integrate them into your pages:

## ✅ Completed Components

### 1. `useDebounce` Hook
**Location**: `apps/web/lib/hooks/use-debounce.ts`

Debounces any value with a configurable delay (default 300ms).

### 2. `SearchInput` Component  
**Location**: `apps/web/components/search-input.tsx`

Reusable search input with:
- Search icon
- Clear button (X)
- Customizable placeholder
- Responsive design

### 3. `NotificationsPopover` Component
**Location**: `apps/web/components/notifications-popover.tsx`

Features:
- Shows recent incidents
- Unread count badge
- "View all incidents" link
- Empty state when no incidents

### 4. Updated TopBar
**Location**: `apps/web/components/top-bar.tsx`

Now includes:
- Functional notification bell
- Unread count badge
- Removed global search (search is now per-page)

---

## How to Add Search to a Page

### Example: Dashboard Page

```tsx
import { useState } from "react";
import { SearchInput } from "@/components/search-input";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const { data: websites } = useQuery({
    queryKey: ["websites"],
    queryFn: getWebsites,
  });

  // Filter data based on debounced search
  const filteredWebsites = websites?.filter((w) => {
    if (!debouncedSearch) return true;
    const search = debouncedSearch.toLowerCase();
    return (
      w.name?.toLowerCase().includes(search) ||
      w.url.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1>Monitors</h1>
        <Button>Create Monitor</Button>
      </div>

      {/* Search */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search monitors..."
        className="max-w-sm"
      />

      {/* Display filtered results */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWebsites?.map((website) => (
          <WebsiteCard key={website.id} {...website} />
        ))}
      </div>

      {/* Empty state for no results */}
      {filteredWebsites?.length === 0 && debouncedSearch && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            No monitors found matching "{debouncedSearch}"
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## Pages to Update

Apply the same pattern to these pages:

### 1. **Dashboard** (`apps/web/app/(dashboard)/page.tsx`)
Filter by: `name`, `url`

### 2. **Incidents** (`apps/web/app/(dashboard)/incidents/page.tsx`)
Filter by: `websiteId`, incident details

### 3. **Heartbeats** (`apps/web/app/(dashboard)/heartbeats/page.tsx`)
Filter by: `name`

### 4. **Status Pages** (`apps/web/app/(dashboard)/status-pages/page.tsx`)
Filter by: `name`, `slug`

### 5. **Alerting** (`apps/web/app/(dashboard)/alerting/page.tsx`)
Filter by: `name`, `type`

---

## Key Points

1. **Always use `debouncedSearch`** for filtering, not the raw `searchQuery`
2. **Show "no results" message** when search returns empty
3. **Keep search local to each page** - don't use global search
4. **Use `className="max-w-sm"`** to limit search input width

---

## Next Steps

1. Add search to each page using the pattern above
2. Test debouncing works (300ms delay)
3. Verify clear button (X) works
4. Check notifications popover shows incidents

The components are ready to use - just import and integrate them!
