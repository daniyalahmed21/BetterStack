"use client";

import { ShieldCheck, Plus, Search, ExternalLink, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const statusPages = [
    {
        id: "1",
        name: "Public Status Page",
        url: "status.example.com",
        monitors: 5,
        subscribers: 1240,
        status: "Published",
    },
    {
        id: "2",
        name: "Internal Services",
        url: "internal-status.example.com",
        monitors: 12,
        subscribers: 45,
        status: "Draft",
    },
];

export default function StatusPagesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Status Pages</h1>
                    <p className="text-sm text-muted-foreground">
                        Communicate service status and incidents to your users.
                    </p>
                </div>
                <Button className="gap-2">
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statusPages.map((page) => (
                    <div
                        key={page.id}
                        className="group rounded-lg border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-foreground">{page.name}</h3>
                                    <a
                                        href={`https://${page.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                                <p className="text-xs text-muted-foreground">{page.url}</p>
                            </div>
                            <div className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                                {page.status}
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                        Monitors
                                    </p>
                                    <p className="text-xs font-medium">{page.monitors}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                        Subscribers
                                    </p>
                                    <p className="text-xs font-medium">{page.subscribers}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
