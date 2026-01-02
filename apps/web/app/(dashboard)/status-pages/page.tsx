"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Plus, Trash2, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";
import { Dialog } from "@/components/ui/dialog";
import { SearchInput } from "@/components/search-input";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
    getStatusPages,
    createStatusPage,
    deleteStatusPage,
    updateStatusPage,
} from "@/lib/api/status-pages";
import { getWebsites } from "@/lib/api/websites";

export default function StatusPagesPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [newStatusPage, setNewStatusPage] = useState({
        name: "",
        slug: "",
        websiteIds: [] as string[],
    });

    const { data: statusPages = [], isLoading } = useQuery({
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

    const updateMutation = useMutation({
        mutationFn: ({ id, ...data }: any) => updateStatusPage(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["status-pages"] });
        },
    });

    const toggleWebsite = (id: string) => {
        setNewStatusPage((prev) => ({
            ...prev,
            websiteIds: prev.websiteIds.includes(id)
                ? prev.websiteIds.filter((w) => w !== id)
                : [...prev.websiteIds, id],
        }));
    };

    return (
        <div className="space-y-8">
            {/* Header */}
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

            {/* Search */}
            <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search status pages..."
                className="max-w-sm"
            />

            {/* Content */}
            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                </div>
            ) : statusPages?.filter((page) => {
                if (!debouncedSearch) return true;
                const search = debouncedSearch.toLowerCase();
                return (
                    page.name.toLowerCase().includes(search) ||
                    page.slug.toLowerCase().includes(search)
                );
            }).length === 0 ? (
                <div className="col-span-full">
                    {debouncedSearch ? (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">No status pages found matching "{debouncedSearch}"</p>
                        </div>
                    ) : (
                        <EmptyState
                            icon={ShieldCheck}
                            title="No status pages yet"
                            description="Create a status page to share uptime and incidents with users."
                            actionLabel="Create Status Page"
                            onAction={() => setIsModalOpen(true)}
                        />
                    )}
                </div>
            ) : (
                <div className="rounded-lg border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="h-10 px-4 font-medium text-muted-foreground">Name</th>
                                    <th className="h-10 px-4 font-medium text-muted-foreground">Slug</th>
                                    <th className="h-10 px-4 font-medium text-muted-foreground">Monitors</th>
                                    <th className="h-10 px-4 font-medium text-muted-foreground">Status</th>
                                    <th className="h-10 px-4 w-[50px]" />
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {statusPages.filter((page) => {
                                    if (!debouncedSearch) return true;
                                    const search = debouncedSearch.toLowerCase();
                                    return (
                                        page.name.toLowerCase().includes(search) ||
                                        page.slug.toLowerCase().includes(search)
                                    );
                                }).map((page) => (
                                    <tr key={page.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-md bg-secondary p-2">
                                                    <ShieldCheck className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium truncate">{page.name}</span>
                                                        <a
                                                            href={`http://localhost:3000/status/${page.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-muted-foreground hover:text-foreground"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 text-muted-foreground font-mono">
                                            /status/{page.slug}
                                        </td>

                                        <td className="p-4 text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4" />
                                                {page.websites?.length || 0}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${page.status === "Published"
                                                        ? "bg-up/15 text-up"
                                                        : "bg-muted text-muted-foreground"
                                                    }`}
                                            >
                                                {page.status}
                                            </span>
                                        </td>

                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        updateMutation.mutate({
                                                            id: page.id,
                                                            status:
                                                                page.status === "Published" ? "Draft" : "Published",
                                                        })
                                                    }
                                                >
                                                    {page.status === "Published" ? "—" : "+"}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:bg-red-500/10"
                                                    onClick={() => deleteMutation.mutate(page.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal unchanged */}
            <Dialog
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Status Page"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Page Name</label>
                        <Input
                            value={newStatusPage.name}
                            onChange={(e) =>
                                setNewStatusPage({ ...newStatusPage, name: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">URL Slug</label>
                        <Input
                            value={newStatusPage.slug}
                            onChange={(e) =>
                                setNewStatusPage({
                                    ...newStatusPage,
                                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                                })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Monitors</label>
                        <div className="rounded-lg border max-h-56 overflow-y-auto">
                            {websites?.map((w) => (
                                <label
                                    key={w.id}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={newStatusPage.websiteIds.includes(w.id)}
                                        onChange={() => toggleWebsite(w.id)}
                                    />
                                    <span className="text-sm">{w.name || w.url}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => createMutation.mutate(newStatusPage)}
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? "Creating..." : "Create Status Page"}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
