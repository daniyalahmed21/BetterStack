"use client";

import { Settings, User, Shield, Bell, CreditCard, Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
                <aside className="flex flex-col gap-1">
                    {[
                        { name: "General", icon: Settings, active: true },
                        { name: "Profile", icon: User },
                        { name: "Security", icon: Shield },
                        { name: "Notifications", icon: Bell },
                        { name: "Billing", icon: CreditCard },
                        { name: "Team", icon: Globe },
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${item.active
                                    ? "bg-secondary text-foreground"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </button>
                    ))}
                </aside>

                <div className="space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold border-b pb-2">Organization Profile</h3>
                        <div className="grid gap-4 max-w-md">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Organization Name
                                </label>
                                <Input defaultValue="BetterStack Team" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Organization URL
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                                        betterstack.com/
                                    </div>
                                    <Input defaultValue="betterstack-team" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold border-b pb-2">Danger Zone</h3>
                        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-foreground">Delete Organization</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Permanently delete your organization and all associated data.
                                    </p>
                                </div>
                                <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white">
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </div>

                    <div className="pt-8 border-t">
                        <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 gap-2">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
