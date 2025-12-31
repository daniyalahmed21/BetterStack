"use client";

import { Activity, Plus, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";

const heartbeats = [
    {
        id: "1",
        name: "Backup Script",
        status: "UP",
        period: "Daily",
        lastPing: "2 hours ago",
        grace: "1 hour",
    },
    {
        id: "2",
        name: "Database Cleanup",
        status: "UP",
        period: "Hourly",
        lastPing: "45 minutes ago",
        grace: "10 minutes",
    },
    {
        id: "3",
        name: "Email Processor",
        status: "DOWN",
        period: "Every 5m",
        lastPing: "15 minutes ago",
        grace: "2 minutes",
    },
];

export default function HeartbeatsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Heartbeats</h1>
                    <p className="text-sm text-muted-foreground">
                        Monitor cron jobs and scheduled tasks.
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Heartbeat
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search heartbeats..." className="pl-9" />
                </div>
            </div>

            <div className="rounded-lg border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 transition-colors">
                                <th className="h-10 px-4 font-medium text-muted-foreground">Name</th>
                                <th className="h-10 px-4 font-medium text-muted-foreground">Status</th>
                                <th className="h-10 px-4 font-medium text-muted-foreground">Period</th>
                                <th className="h-10 px-4 font-medium text-muted-foreground">Last Ping</th>
                                <th className="h-10 px-4 font-medium text-muted-foreground">Grace</th>
                                <th className="h-10 px-4 w-[50px]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {heartbeats.map((hb) => (
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
                                        <StatusBadge status={hb.status as "UP" | "DOWN"} />
                                    </td>
                                    <td className="p-4 text-muted-foreground">{hb.period}</td>
                                    <td className="p-4 text-muted-foreground">{hb.lastPing}</td>
                                    <td className="p-4 text-muted-foreground">{hb.grace}</td>
                                    <td className="p-4">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
