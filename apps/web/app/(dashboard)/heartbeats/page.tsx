"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Activity, Plus, Search, MoreHorizontal, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { getHeartbeats, createHeartbeat, deleteHeartbeat } from "@/lib/api/heartbeats";
import { Skeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";
import { Dialog } from "@/components/ui/dialog";
import { SearchInput } from "@/components/search-input";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function HeartbeatsPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [newHeartbeat, setNewHeartbeat] = useState({
        name: "",
        period: 300,
        grace: 60,
    });

    const { data: heartbeats, isLoading } = useQuery({
        queryKey: ["heartbeats"],
        queryFn: getHeartbeats,
    });

    const createMutation = useMutation({
        mutationFn: createHeartbeat,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["heartbeats"] });
            setIsModalOpen(false);
            setNewHeartbeat({ name: "", period: 300, grace: 60 });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteHeartbeat,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["heartbeats"] });
        },
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(newHeartbeat);
    };

    const copyPingUrl = (id: string) => {
        const url = `http://localhost:3001/heartbeats/${id}/ping`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Heartbeats</h1>
                    <p className="text-sm text-muted-foreground">
                        Monitor cron jobs and scheduled tasks.
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Create Heartbeat
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search heartbeats..."
                    className="flex-1 max-w-sm"
                />
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                </div>
            ) : heartbeats?.filter((hb) => {
                if (!debouncedSearch) return true;
                const search = debouncedSearch.toLowerCase();
                return hb.name.toLowerCase().includes(search);
            }).length === 0 ? (
                <div className="col-span-full">
                    {debouncedSearch ? (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">No heartbeats found matching "{debouncedSearch}"</p>
                        </div>
                    ) : (
                        <EmptyState
                            icon={Activity}
                            title="No heartbeats yet"
                            description="Create a heartbeat to monitor your cron jobs, background tasks, or any periodic process."
                            actionLabel="Create Heartbeat"
                            onAction={() => setIsModalOpen(true)}
                        />
                    )}
                </div>
            ) : (
                <div className="rounded-lg border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50 transition-colors">
                                    <th className="h-10 px-4 font-medium text-muted-foreground">Name</th>
                                    <th className="h-10 px-4 font-medium text-muted-foreground">Status</th>
                                    <th className="h-10 px-4 font-medium text-muted-foreground">Period / Grace</th>
                                    <th className="h-10 px-4 font-medium text-muted-foreground">Last Ping</th>
                                    <th className="h-10 px-4 font-medium text-muted-foreground">Ping URL</th>
                                    <th className="h-10 px-4 w-[50px]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {heartbeats?.filter((hb) => {
                                    if (!debouncedSearch) return true;
                                    const search = debouncedSearch.toLowerCase();
                                    return hb.name.toLowerCase().includes(search);
                                }).map((hb) => (
                                    <tr key={hb.id} className="transition-colors hover:bg-muted/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-md bg-secondary p-2">
                                                    <Activity className="h-4 w-4 text-foreground" />
                                                </div>
                                                <span className="font-medium">{hb.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={hb.status} />
                                        </td>
                                        <td className="p-4 text-muted-foreground">
                                            {hb.period}s / {hb.grace}s
                                        </td>
                                        <td className="p-4 text-muted-foreground">
                                            {hb.lastPingAt ? new Date(hb.lastPingAt).toLocaleString() : "Never"}
                                        </td>
                                        <td className="p-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-2"
                                                onClick={() => copyPingUrl(hb.id)}
                                            >
                                                {copiedId === hb.id ? (
                                                    <Check className="h-3 w-3 text-up" />
                                                ) : (
                                                    <Copy className="h-3 w-3" />
                                                )}
                                                Copy URL
                                            </Button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                onClick={() => deleteMutation.mutate(hb.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Dialog
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Heartbeat"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            placeholder="Backup Script"
                            required
                            value={newHeartbeat.name}
                            onChange={(e) => setNewHeartbeat({ ...newHeartbeat, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Period (seconds)</label>
                            <Input
                                type="number"
                                min={30}
                                value={newHeartbeat.period}
                                onChange={(e) => setNewHeartbeat({ ...newHeartbeat, period: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Grace (seconds)</label>
                            <Input
                                type="number"
                                min={0}
                                value={newHeartbeat.grace}
                                onChange={(e) => setNewHeartbeat({ ...newHeartbeat, grace: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? "Creating..." : "Create Heartbeat"}
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
