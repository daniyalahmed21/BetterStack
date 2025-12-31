"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ExternalLink,
    Clock,
    Globe,
    Zap,
    Pencil,
    Trash2,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { getWebsiteTicks, deleteWebsite, updateWebsite, getRegions, Region } from "@/lib/api/websites";
import { Sparkline } from "./sparkline";
import { StatusBadge } from "./status-badge";
import { Skeleton } from "./skeleton";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { Input } from "./ui/input";

interface WebsiteCardProps {
    id: string;
    name: string | null;
    url: string;
    status: "Up" | "Down" | "Unknown";
    lastChecked?: string | null;
    frequency?: number;
    timeout?: number;
    regions?: Region[];
}

export function WebsiteCard({ id, name, url, status, lastChecked, frequency = 60, timeout = 30, regions: initialRegions = [] }: WebsiteCardProps) {
    const queryClient = useQueryClient();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [editData, setEditData] = useState({
        name: name || "",
        url,
        frequency,
        timeout,
        regionIds: initialRegions.map(r => r.id)
    });

    const { data: ticks, isLoading: isTicksLoading } = useQuery({
        queryKey: ["website-ticks", id],
        queryFn: () => getWebsiteTicks(id),
        refetchInterval: 30000,
    });

    const { data: allRegions } = useQuery({
        queryKey: ["regions"],
        queryFn: getRegions,
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteWebsite(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["websites"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: () => updateWebsite(id, editData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["websites"] });
            setIsEditOpen(false);
        },
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate();
    };

    const responseTime = ticks?.[0]?.responseTimeMs || 0;
    const sparklineData = ticks?.map((t) => t.responseTimeMs).reverse() || [];
    const displayStatus = status.toUpperCase() as "UP" | "DOWN" | "UNKNOWN";

    return (
        <>
            <div className="group relative rounded-xl border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold leading-none tracking-tight">
                                {name || url}
                            </h3>
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                        <p className="text-sm text-muted-foreground">{url.replace(/^https?:\/\//, "")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={displayStatus} />
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setIsEditOpen(true)}
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this monitor?")) {
                                        deleteMutation.mutate();
                                    }
                                }}
                                disabled={deleteMutation.isPending}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                <Zap className="h-3 w-3" />
                                Response
                            </div>
                            <p className="text-sm font-medium">{responseTime}ms</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                <Globe className="h-3 w-3" />
                                Regions
                            </div>
                            <p className="text-sm font-medium">{initialRegions.length || 1}/4</p>
                        </div>
                    </div>
                    <div className="h-[32px] w-[100px]">
                        {isTicksLoading ? (
                            <Skeleton className="h-full w-full" />
                        ) : (
                            <Sparkline data={sparklineData} width={100} height={32} />
                        )}
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                            {lastChecked ? new Date(lastChecked).toLocaleTimeString() : "Never"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{frequency}s interval</span>
                    </div>
                </div>
            </div>

            <Dialog
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Monitor"
            >
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">URL</label>
                        <Input
                            required
                            type="url"
                            value={editData.url}
                            onChange={(e) => setEditData({ ...editData, url: e.target.value })}
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
                                    <label className="text-sm font-medium">Frequency (sec)</label>
                                    <Input
                                        type="number"
                                        min={30}
                                        max={3600}
                                        value={editData.frequency}
                                        onChange={(e) => setEditData({ ...editData, frequency: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Timeout (sec)</label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={60}
                                        value={editData.timeout}
                                        onChange={(e) => setEditData({ ...editData, timeout: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Check from Regions</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {allRegions?.map((region) => (
                                        <label key={region.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-secondary/50 p-1.5 rounded transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={editData.regionIds.includes(region.id)}
                                                onChange={(e) => {
                                                    const ids = e.target.checked
                                                        ? [...editData.regionIds, region.id]
                                                        : editData.regionIds.filter(id => id !== region.id);
                                                    setEditData({ ...editData, regionIds: ids });
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
                            onClick={() => setIsEditOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Dialog>
        </>
    );
}
