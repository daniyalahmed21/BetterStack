"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Clock, Zap, Globe, ChevronDown } from "lucide-react";
import { getWebsites, getWebsiteAnalytics } from "@/lib/api/websites";
import { AnalyticsChart } from "@/components/analytics-chart";

export default function AnalyticsPage() {
    const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);

    const { data: websites, isLoading: isWebsitesLoading } = useQuery({
        queryKey: ["websites"],
        queryFn: getWebsites,
    });

    // Set default website if not selected
    if (!selectedWebsiteId && websites && websites.length > 0) {
        setSelectedWebsiteId(websites[0].id);
    }

    const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
        queryKey: ["analytics", selectedWebsiteId],
        queryFn: () => getWebsiteAnalytics(selectedWebsiteId!),
        enabled: !!selectedWebsiteId,
    });

    const selectedWebsite = websites?.find(w => w.id === selectedWebsiteId);

    // Mock data for the detailed charts since the API only returns aggregate stats for now
    const uptimeData = Array.from({ length: 24 }).map((_, i) => ({
        name: `${i}:00`,
        uptime: 99 + Math.random(),
    }));

    const responseTimeData = Array.from({ length: 24 }).map((_, i) => ({
        name: `${i}:00`,
        responseTime: 100 + Math.random() * 100,
    }));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-sm text-muted-foreground">
                        Deep dive into your service performance and reliability.
                    </p>
                </div>
                <div className="relative">
                    <select
                        value={selectedWebsiteId || ""}
                        onChange={(e) => setSelectedWebsiteId(e.target.value)}
                        className="h-9 w-64 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
                    >
                        {websites?.map((w) => (
                            <option key={w.id} value={w.id}>
                                {w.name || w.url}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div className="rounded-md bg-secondary p-2">
                            <TrendingUp className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                30D Uptime
                            </p>
                            <div className="flex items-center justify-end gap-2">
                                <span className="text-2xl font-bold">
                                    {isAnalyticsLoading ? "..." : `${analytics?.last30Days?.uptime}%`}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 h-[60px] w-full">
                        <AnalyticsChart data={uptimeData} type="area" dataKey="uptime" color="#10b981" height={60} />
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div className="rounded-md bg-secondary p-2">
                            <Zap className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                30D Avg Response
                            </p>
                            <div className="flex items-center justify-end gap-2">
                                <span className="text-2xl font-bold">
                                    {isAnalyticsLoading ? "..." : `${analytics?.last30Days?.avgResponseTime}ms`}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 h-[60px] w-full">
                        <AnalyticsChart data={responseTimeData} type="area" dataKey="responseTime" color="#3b82f6" height={60} />
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div className="rounded-md bg-secondary p-2">
                            <Clock className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Status
                            </p>
                            <div className="flex items-center justify-end gap-2">
                                <span className={`text-2xl font-bold ${selectedWebsite?.status === "Up" ? "text-up" : "text-down"}`}>
                                    {selectedWebsite?.status || "Unknown"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last checked</span>
                        <span>{selectedWebsite?.lastCheckedAt ? new Date(selectedWebsite.lastCheckedAt).toLocaleTimeString() : "Never"}</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Response Time (Last 24h)
                    </h3>
                    <div className="h-[200px]">
                        <AnalyticsChart data={responseTimeData} type="line" dataKey="responseTime" color="#3b82f6" height={200} />
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Uptime (Last 24h)
                    </h3>
                    <div className="h-[200px]">
                        <AnalyticsChart data={uptimeData} type="area" dataKey="uptime" color="#10b981" height={200} />
                    </div>
                </div>
            </div>
        </div>
    );

}