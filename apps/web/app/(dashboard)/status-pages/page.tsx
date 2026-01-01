"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Plus, Search, ExternalLink, Trash2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStatusPages, createStatusPage, deleteStatusPage } from "@/lib/api/status-pages";
import { getWebsites } from "@/lib/api/websites";
import { Skeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";
import { Dialog } from "@/components/ui/dialog";

export default function StatusPagesPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStatusPage, setNewStatusPage] = useState({
        name: "",
        slug: "",
        websiteIds: [] as string[],
    });

    const { data: statusPages, isLoading } = useQuery({
        queryKey: ["status-pages"],
        queryFn: getStatusPages,
    });

    const { data: websites } = useQuery({
        queryKey: ["websites"],
        queryFn: getWebsites,
    });

    const createMutation = useMutation({
        mutationFn: createStatusPage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["status-pages"] });
            setIsModalOpen(false);
            setNewStatusPage({ name: "", slug: "", websiteIds: [] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteStatusPage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["status-pages"] });
        },
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(newStatusPage);
    };

    const toggleWebsite = (id: string) => {
        setNewStatusPage((prev) => ({
            ...prev,
            websiteIds: prev.websiteIds.includes(id)
                ? prev.websiteIds.filter((wid) => wid !== id)
                : [...prev.websiteIds, id],
        }));
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Status Pages</h1>
                    <p className="text-sm text-muted-foreground">
                        Communicate service status and incidents to your users.
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Create Status Page
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search status pages..." className="pl-9" />
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
                    ))}
                </div>
            ) : statusPages?.length === 0 ? (
                <EmptyState
                    icon={ShieldCheck}
                    title="No status pages yet"
                    description="Create a status page to share the uptime and performance of your services with your users."
                    actionLabel="Create Status Page"
                    onAction={() => setIsModalOpen(true)}
                />
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {statusPages?.map((page) => (
                        <div
                            key={page.id}
                            className="group relative rounded-lg border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold text-foreground">{page.name}</h3>
                                        <a
                                            href={`http://localhost:3000/status/${page.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                    <p className="text-xs text-muted-foreground">/{page.slug}</p>
                                </div>
                                <div className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${page.status === "Published" ? "bg-up/10 text-up" : "bg-muted text-muted-foreground"
                                    }`}>
                                    {page.status}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                            Monitors
                                        </p>
                                        <p className="text-xs font-medium">{page.websites?.length || 0}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                    onClick={() => deleteMutation.mutate(page.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Status Page"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            placeholder="Public Status Page"
                            required
                            value={newStatusPage.name}
                            onChange={(e) => setNewStatusPage({ ...newStatusPage, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Slug</label>
                        <div className="flex gap-2">
                            <div className="flex items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                                /status/
                            </div>
                            <Input
                                placeholder="my-status"
                                required
                                value={newStatusPage.slug}
                                onChange={(e) => setNewStatusPage({ ...newStatusPage, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                            Select Monitors
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto p-1 border rounded-md">
                            {websites?.map((w) => (
                                <label key={w.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-secondary/50 p-2 rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={newStatusPage.websiteIds.includes(w.id)}
                                        onChange={() => toggleWebsite(w.id)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    {w.name || w.url}
                                </label>
                            ))}
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
                            {createMutation.isPending ? "Creating..." : "Create Status Page"}
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
