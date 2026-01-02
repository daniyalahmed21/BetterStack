"use client";

import { LogOut, User } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { NotificationsPopover } from "./notifications-popover";

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
                <h2 className="text-lg font-semibold">BetterStack</h2>
            </div>
            <div className="flex items-center gap-4">
                <NotificationsPopover />

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
