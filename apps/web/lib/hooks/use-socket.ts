"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "@/lib/auth-client";

export function useSocket() {
    const { data: session } = useSession();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!session?.user?.id) return;

        const socket = io("http://localhost:3001", {
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected to Socket.io");
            socket.emit("join", session.user.id);
        });

        return () => {
            socket.disconnect();
        };
    }, [session?.user?.id]);

    return socketRef.current;
}
