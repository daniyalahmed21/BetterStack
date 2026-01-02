"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Filter, ChevronDown, ChevronUp, Globe, Clock, Zap } from "lucide-react";
import { getWebsites, createWebsite, getRegions } from "@/lib/api/websites";
import { WebsiteCard } from "@/components/website-card";
import { Skeleton } from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useSocket } from "@/lib/hooks/use-socket";
import { EmptyState } from "@/components/empty-state";
import { SearchInput } from "@/components/search-input";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [newWebsite, setNewWebsite] = useState({
    name: "",
    url: "",
    frequency: 60,
    timeout: 30,
    regionIds: [] as string[]
  });

  const { data: websites, isLoading, error } = useQuery({
    queryKey: ["websites"],
    queryFn: getWebsites,
  });

  const { data: regions } = useQuery({
    queryKey: ["regions"],
    queryFn: getRegions,
  });

  useEffect(() => {
    if (!socket) return;

    socket.on("website.updated", (data) => {
      console.log("Website updated via socket:", data);
      queryClient.invalidateQueries({ queryKey: ["websites"] });
    });

    return () => {
      socket.off("website.updated");
    };
  }, [socket, queryClient]);

  const createMutation = useMutation({
    mutationFn: createWebsite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      setIsModalOpen(false);
      setShowAdvanced(false);
      setNewWebsite({
        name: "",
        url: "",
        frequency: 60,
        timeout: 30,
        regionIds: []
      });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newWebsite);
  };

  const filteredWebsites = websites?.filter((w) => {
    if (!debouncedSearch) return true;
    const search = debouncedSearch.toLowerCase();
    return (
      w.name?.toLowerCase().includes(search) ||
      w.url.toLowerCase().includes(search)
    );
  });

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Error loading websites</p>
          <Button
            variant="ghost"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monitors</h1>
          <p className="text-sm text-muted-foreground">
            Real-time status of your services and websites.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Monitor
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search monitors..."
          className="flex-1 max-w-sm"
        />
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))
          : filteredWebsites?.length === 0 ? (
            <div className="col-span-full">
              {debouncedSearch ? (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">No monitors found matching "{debouncedSearch}"</p>
                </div>
              ) : (
                <EmptyState
                  icon={Plus}
                  title="No monitors yet"
                  description="Create your first monitor to start tracking the uptime and performance of your websites."
                  actionLabel="Create Monitor"
                  onAction={() => setIsModalOpen(true)}
                />
              )}
            </div>
          ) : filteredWebsites?.map((website) => (
            <WebsiteCard
              key={website.id}
              id={website.id}
              name={website.name || website.url}
              url={website.url}
              status={website.status}
              lastChecked={website.lastCheckedAt}
              frequency={website?.frequency}
              timeout={website?.timeout}
              regions={website?.regions}
            />
          ))}
      </div>

      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Monitor"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name (Optional)</label>
            <Input
              placeholder="My Website"
              value={newWebsite.name}
              onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">URL</label>
            <Input
              placeholder="https://example.com"
              required
              type="url"
              value={newWebsite.url}
              onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-4 border-t pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    Frequency (sec)
                  </label>
                  <Input
                    type="number"
                    min={30}
                    max={3600}
                    value={newWebsite.frequency}
                    onChange={(e) => setNewWebsite({ ...newWebsite, frequency: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                    Timeout (sec)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={newWebsite.timeout}
                    onChange={(e) => setNewWebsite({ ...newWebsite, timeout: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  Check from Regions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {regions?.map((region: any) => (
                    <label key={region.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-secondary/50 p-1.5 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={newWebsite.regionIds.includes(region.id)}
                        onChange={(e) => {
                          const ids = e.target.checked
                            ? [...newWebsite.regionIds, region.id]
                            : newWebsite.regionIds.filter(id => id !== region.id);
                          setNewWebsite({ ...newWebsite, regionIds: ids });
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      {region.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Monitor"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}