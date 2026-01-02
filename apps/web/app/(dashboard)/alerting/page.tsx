"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Bell,
    Plus,
    Mail,
    Slack as SlackIcon,
    MessageSquare,
    Phone,
    MoreHorizontal,
    Trash2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getAlertChannels, createAlertChannel, deleteAlertChannel, AlertChannel } from "@/lib/api/alert-channels";
import { Skeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";
import { SearchInput } from "@/components/search-input";
import { useDebounce } from "@/lib/hooks/use-debounce";

const typeIcons = {
    Email: Mail,
    Slack: SlackIcon,
    SMS: MessageSquare,
    Voice: Phone,
};

export default function AlertingPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [newChannel, setNewChannel] = useState({
        name: "",
        type: "Email" as AlertChannel["type"],
        target: "",
    });

    const { data: channels, isLoading, error } = useQuery({
        queryKey: ["alert-channels"],
        queryFn: getAlertChannels,
    });

    const createMutation = useMutation({
        mutationFn: createAlertChannel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alert-channels"] });
            setIsModalOpen(false);
            setNewChannel({ name: "", type: "Email", target: "" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAlertChannel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alert-channels"] });
        },
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(newChannel);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Alerting</h1>
                    <p className="text-sm text-muted-foreground">
                        Configure how you want to be notified when things go wrong.
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add Channel
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search alert channels..."
                    className="flex-1 max-w-sm"
                />
            </div>

            <div className="grid gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))
                ) : error ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Failed to load alert channels</p>
                    </div>
                ) : channels?.filter((channel) => {
                    if (!debouncedSearch) return true;
                    const search = debouncedSearch.toLowerCase();
                    return (
                        channel.name.toLowerCase().includes(search) ||
                        channel.type.toLowerCase().includes(search)
                    );
                }).length === 0 ? (
                    <div className="col-span-full">
                        {debouncedSearch ? (
                            <div className="text-center py-12">
                                <p className="text-sm text-muted-foreground">No alert channels found matching "{debouncedSearch}"</p>
                            </div>
                        ) : (
                            <EmptyState
                                icon={Bell}
                                title="No alert channels"
                                description="Add your first alert channel to start receiving notifications about incidents."
                                actionLabel="Add Channel"
                                onAction={() => setIsModalOpen(true)}
                            />
                        )}
                    </div>
                ) : (
                    channels?.filter((channel) => {
                        if (!debouncedSearch) return true;
                        const search = debouncedSearch.toLowerCase();
                        return (
                            channel.name.toLowerCase().includes(search) ||
                            channel.type.toLowerCase().includes(search)
                        );
                    }).map((channel) => {
                        const Icon = typeIcons[channel.type];
                        return (
                            <div
                                key={channel.id}
                                className="flex items-center justify-between rounded-lg border bg-card p-4 transition-all hover:border-foreground/20"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="rounded-md bg-secondary p-2.5">
                                        <Icon className="h-5 w-5 text-foreground" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold">{channel.name}</h3>
                                            <span
                                                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${channel.active
                                                    ? "bg-up/10 text-up"
                                                    : "bg-muted text-muted-foreground"
                                                    }`}
                                            >
                                                {channel.active ? "Active" : "Inactive"}
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
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                        onClick={() => {
                                            if (confirm("Are you sure you want to delete this channel?")) {
                                                deleteMutation.mutate(channel.id);
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
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
                            description: "Send alerts to all active channels.",
                        },
                        {
                            step: "2",
                            title: "After 5 minutes",
                            description: "Retry sending alerts if incident is still open.",
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

            <Dialog
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Alert Channel"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Channel Name</label>
                        <Input
                            placeholder="e.g. Engineering Slack"
                            required
                            value={newChannel.name}
                            onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(["Email", "Slack", "SMS", "Voice"] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setNewChannel({ ...newChannel, type })}
                                    className={`flex items-center gap-2 rounded-md border p-2 text-sm transition-all ${newChannel.type === type
                                        ? "border-foreground bg-secondary"
                                        : "hover:bg-secondary/50"
                                        }`}
                                >
                                    {type === "Email" && <Mail className="h-4 w-4" />}
                                    {type === "Slack" && <SlackIcon className="h-4 w-4" />}
                                    {type === "SMS" && <MessageSquare className="h-4 w-4" />}
                                    {type === "Voice" && <Phone className="h-4 w-4" />}
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            {newChannel.type === "Email" && "Email Address"}
                            {newChannel.type === "Slack" && "Webhook URL"}
                            {newChannel.type === "SMS" && "Phone Number"}
                            {newChannel.type === "Voice" && "Phone Number"}
                        </label>
                        <Input
                            placeholder={
                                newChannel.type === "Email" ? "name@example.com" :
                                    newChannel.type === "Slack" ? "https://hooks.slack.com/services/..." :
                                        "+1 (555) 000-0000"
                            }
                            required
                            value={newChannel.target}
                            onChange={(e) => setNewChannel({ ...newChannel, target: e.target.value })}
                        />
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
                            {createMutation.isPending ? "Adding..." : "Add Channel"}
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
