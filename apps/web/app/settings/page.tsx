"use client";

import { useState } from "react";
import { Settings, User, Shield, Bell, CreditCard, Globe, LogOut, Mail, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type Tab = "General" | "Profile" | "Security" | "Notifications" | "Billing" | "Team";

export default function SettingsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("General");

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    const tabs = [
        { name: "General", icon: Settings },
        { name: "Profile", icon: User },
        { name: "Security", icon: Shield },
        { name: "Notifications", icon: Bell },
        { name: "Billing", icon: CreditCard },
        { name: "Team", icon: Globe },
    ];

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
                    {tabs.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name as Tab)}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeTab === item.name
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </button>
                    ))}
                </aside>

                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    {activeTab === "General" && (
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
                        </div>
                    )}

                    {activeTab === "Profile" && (
                        <div className="space-y-8">
                            <section className="space-y-4">
                                <h3 className="text-sm font-semibold border-b pb-2">Personal Information</h3>
                                <div className="grid gap-4 max-w-md">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Full Name
                                        </label>
                                        <Input defaultValue={session?.user?.name || ""} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Email Address
                                        </label>
                                        <Input defaultValue={session?.user?.email || ""} disabled />
                                        <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === "Team" && (
                        <div className="space-y-8">
                            <section className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h3 className="text-sm font-semibold">Team Members</h3>
                                    <Button size="sm" className="h-8 gap-1">
                                        <Plus className="h-3.5 w-3.5" />
                                        Invite Member
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: session?.user?.name || "You", email: session?.user?.email || "", role: "Owner", status: "Active" },
                                        { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
                                        { name: "Jane Smith", email: "jane@example.com", role: "Member", status: "Pending" },
                                    ].map((member) => (
                                        <div key={member.email} className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{member.name}</p>
                                                    <p className="text-xs text-muted-foreground">{member.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-medium text-muted-foreground">{member.role}</span>
                                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${member.status === "Active" ? "bg-up/10 text-up" : "bg-muted text-muted-foreground"
                                                    }`}>
                                                    {member.status}
                                                </span>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {(activeTab === "Security" || activeTab === "Notifications" || activeTab === "Billing") && (
                        <div className="flex flex-col items-center justify-center h-[300px] rounded-lg border border-dashed text-center">
                            <p className="text-sm text-muted-foreground">
                                {activeTab} settings are coming soon.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </div>

                    <div className="pt-8 border-t">
                        <Button
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 gap-2"
                            onClick={handleSignOut}
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
