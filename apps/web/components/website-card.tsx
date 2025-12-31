"use client";

import { ExternalLink, Clock, Zap } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { Sparkline } from "./sparkline";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getWebsiteTicks } from "@/lib/api/websites";
import { Skeleton } from "./skeleton";

interface WebsiteCardProps {
    id: string;
    url: string;
    name: string | null;
    status: "Up" | "Down" | "Unknown";
    lastCheckedAt: string | null;
    responseTime?: number;
    regions?: { name: string; status: "Up" | "Down" }[];
}

export function WebsiteCard({
    id,
    url,
    name,
    status,
    lastCheckedAt,
    responseTime,
    regions = [],
}: WebsiteCardProps) {
    const { data: ticks, isLoading } = useQuery({
        queryKey: ["ticks", id],
        queryFn: () => getWebsiteTicks(id),
        refetchInterval: 30000,
    });

    const history = ticks?.map((tick) => tick.responseTimeMs) || [];
    const displayStatus = status.toUpperCase() as "UP" | "DOWN" | "UNKNOWN";

    return (
        <div className="group rounded-lg border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-sm">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{name || url}</h3>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                    <p className="text-xs text-muted-foreground">{url.replace(/^https?:\/\//, "")}</p>
                </div>
                <StatusBadge status={displayStatus} />
            </div>

            <div className="mt-6 flex items-end justify-between">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                <Clock className="h-3 w-3" />
                                Last Checked
                            </div>
                            <p className="text-xs font-medium">
                                {lastCheckedAt ? new Date(lastCheckedAt).toLocaleTimeString() : "Never"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                <Zap className="h-3 w-3" />
                                Avg. Response
                            </div>
                            <p className="text-xs font-medium">{responseTime || 0}ms</p>
                        </div>
                    </div>

                    <div className="flex gap-1">
                        {regions.map((region, i) => (
                            <div
                                key={i}
                                title={`${region.name}: ${region.status}`}
                                className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    region.status === "Up" ? "bg-up" : "bg-down"
                                )}
                            />
                        ))}
                    </div>
                </div>

                <div className="text-muted-foreground/40 group-hover:text-foreground/60 transition-colors">
                    {isLoading ? (
                        <Skeleton className="h-[30px] w-[80px]" />
                    ) : (
                        <Sparkline data={history} width={80} height={30} />
                    )}
                </div>
            </div>
        </div>
    );
}
