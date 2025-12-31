"use client";

import { Search, Plus, Bell, LogOut, User } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function TopBar() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push("/login");
    };

    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-8">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search monitors..."
                        className="h-9 w-64 rounded-md border bg-background pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-card" />
                </Button>

                {session?.user ? (
                    <div className="flex items-center gap-3 pl-4 border-l">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium">{session.user.name}</span>
                            <span className="text-[10px] text-muted-foreground">{session.user.email}</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                            <User className="h-4 w-4" />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                            Login
                        </Button>
                        <Button size="sm" onClick={() => router.push("/signup")}>
                            Sign up
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
