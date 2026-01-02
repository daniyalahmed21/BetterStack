"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, updateUser } from "@/lib/api/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building, Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("general");

    const { data: user, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });

    const [formData, setFormData] = useState({
        name: "",
        organizationName: "",
        email: "",
        timezone: "UTC", // Dummy timezone for now
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                organizationName: user.organizationName || "",
                email: user.email,
                timezone: "UTC",
            });
        }
    }, [user]);

    const updateMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.success("Settings updated successfully");
        },
        onError: () => {
            toast.error("Failed to update settings");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            name: formData.name,
            organizationName: formData.organizationName
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general" className="gap-2">
                        <Building className="h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="text-lg font-medium mb-4">Organization Settings</h3>
                        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Organization Name</label>
                                <Input
                                    value={formData.organizationName}
                                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                                    placeholder="My Organization"
                                />
                                <p className="text-xs text-muted-foreground">
                                    This is the name that will be displayed on your status pages and emails.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Timezone</label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.timezone}
                                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                >
                                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                                    <option value="EST">EST (Eastern Standard Time)</option>
                                    <option value="PST">PST (Pacific Standard Time)</option>
                                    <option value="CET">CET (Central European Time)</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </TabsContent>

                <TabsContent value="profile" className="space-y-4">
                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="text-lg font-medium mb-4">Personal Profile</h3>
                        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-muted-foreground">
                                    {formData.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <Button variant="outline" size="sm" type="button">
                                        Change Avatar
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input
                                    value={formData.email}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Email address cannot be changed. Contact support for assistance.
                                </p>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
