"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { getIncidents } from "@/lib/api/incidents";
import { cn } from "@/lib/utils";

export function NotificationsPopover() {
    const [open, setOpen] = useState(false);

    const { data: incidents = [] } = useQuery({
        queryKey: ["incidents"],
        queryFn: getIncidents,
    });

    // Get recent incidents (last 10)
    const recentIncidents = incidents.slice(0, 10);
    const unreadCount = incidents.filter((i) => i.status === "Open").length;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {unreadCount} unread
                        </span>
                    )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    {recentIncidents.length === 0 ? (
                        <div className="py-12 text-center">
                            <CheckCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                                No incidents to report
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                All systems operational
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {recentIncidents.map((incident) => (
                                <div
                                    key={incident.id}
                                    className={cn(
                                        "px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer",
                                        incident.status === "Open" && "bg-red-500/5"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={cn(
                                                "mt-0.5 rounded-full p-1",
                                                incident.status === "Open"
                                                    ? "bg-red-500/10"
                                                    : "bg-green-500/10"
                                            )}
                                        >
                                            {incident.status === "Open" ? (
                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                            ) : (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {incident.status === "Open"
                                                    ? "Incident Started"
                                                    : "Incident Resolved"}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Website ID: {incident.websiteId.slice(0, 8)}...
                                            </p>
                                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                    {new Date(incident.startedAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {recentIncidents.length > 0 && (
                    <div className="border-t px-4 py-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => {
                                setOpen(false);
                                window.location.href = "/incidents";
                            }}
                        >
                            View all incidents
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
