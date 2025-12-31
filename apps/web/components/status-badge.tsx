import { cn } from "@/lib/utils";

type Status = "UP" | "DOWN" | "UNKNOWN";

interface StatusBadgeProps {
    status: Status;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const statusConfig = {
        UP: {
            label: "UP",
            dotClass: "bg-up",
            bgClass: "bg-up/10 text-up border-up/20",
        },
        DOWN: {
            label: "DOWN",
            dotClass: "bg-down",
            bgClass: "bg-down/10 text-down border-down/20",
        },
        UNKNOWN: {
            label: "UNKNOWN",
            dotClass: "bg-unknown",
            bgClass: "bg-unknown/10 text-unknown border-unknown/20",
        },
    };

    const config = statusConfig[status];

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider",
                config.bgClass,
                className
            )}
        >
            <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
            {config.label}
        </div>
    );
}
