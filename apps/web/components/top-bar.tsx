import { Search, Plus, Bell } from "lucide-react";

export function TopBar() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-8">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search monitors..."
                        className="h-9 w-64 rounded-md border bg-background pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="flex h-9 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
                    <Plus className="h-4 w-4" />
                    Create Monitor
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-md border bg-background transition-colors hover:bg-secondary">
                    <Bell className="h-4 w-4" />
                </button>
            </div>
        </header>
    );
}
