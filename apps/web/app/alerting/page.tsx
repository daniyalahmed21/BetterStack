"use client";

import { Bell, Plus, Mail, Slack, MessageSquare, Phone, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const channels = [
    {
        id: "1",
        name: "Engineering Team",
        type: "Email",
        target: "eng@example.com",
        icon: Mail,
        status: "Active",
    },
    {
        id: "2",
        name: "Slack #incidents",
        type: "Slack",
        target: "#incidents-channel",
        icon: Slack,
        status: "Active",
    },
    {
        id: "3",
        name: "On-call SMS",
        type: "SMS",
        target: "+1 (555) 000-0000",
        icon: MessageSquare,
        status: "Inactive",
    },
    {
        id: "4",
        name: "Voice Call",
        type: "Voice",
        target: "+1 (555) 000-0000",
        icon: Phone,
        status: "Active",
    },
];

export default function AlertingPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Alerting</h1>
                    <p className="text-sm text-muted-foreground">
                        Configure how you want to be notified when things go wrong.
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Channel
                </Button>
            </div>

            <div className="grid gap-6">
                {channels.map((channel) => (
                    <div
                        key={channel.id}
                        className="flex items-center justify-between rounded-lg border bg-card p-4 transition-all hover:border-foreground/20"
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-secondary p-2.5">
                                <channel.icon className="h-5 w-5 text-foreground" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold">{channel.name}</h3>
                                    <span
                                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${channel.status === "Active"
                                                ? "bg-up/10 text-up"
                                                : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {channel.status}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {channel.type} • {channel.target}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                Test
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border bg-card p-6">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Escalation Policy
                </h3>
                <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                    {[
                        {
                            step: "1",
                            title: "Immediate Notification",
                            description: "Send alerts to Engineering Team and Slack #incidents.",
                        },
                        {
                            step: "2",
                            title: "After 5 minutes",
                            description: "Send SMS to on-call engineer if incident is still open.",
                        },
                        {
                            step: "3",
                            title: "After 15 minutes",
                            description: "Trigger Voice Call to engineering manager.",
                        },
                    ].map((policy) => (
                        <div key={policy.step} className="relative pl-10">
                            <div className="absolute left-0 top-1 h-[34px] w-[34px] rounded-full border bg-background flex items-center justify-center text-xs font-bold">
                                {policy.step}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">{policy.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{policy.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
