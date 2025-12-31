"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    AlertCircle,
    Settings,
    ShieldCheck,
    Activity,
    BarChart3,
    Bell,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Incidents", href: "/incidents", icon: AlertCircle },
    { name: "Heartbeats", href: "/heartbeats", icon: Activity },
    { name: "Status Pages", href: "/status-pages", icon: ShieldCheck },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Alerting", href: "/alerting", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
                    {/* <div className="h-6 w-6 rounded bg-foreground" /> */}
                    <img src="logo.png" alt="logo" width={24} height={24} />
                    <span>BetterStack</span>
                </Link>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-secondary text-foreground"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t p-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-medium truncate">
                            {session?.user?.name || "Guest User"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">Pro Plan</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
