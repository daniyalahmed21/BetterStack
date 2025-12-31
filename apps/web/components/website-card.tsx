import { ExternalLink, Clock, Zap } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { Sparkline } from "./sparkline";
import { cn } from "@/lib/utils";

interface WebsiteCardProps {
    url: string;
    name: string;
    status: "UP" | "DOWN" | "UNKNOWN";
    lastChecked: string;
    responseTime: number;
    history: number[];
    regions: { name: string; status: "UP" | "DOWN" }[];
}

export function WebsiteCard({
    url,
    name,
    status,
    lastChecked,
    responseTime,
    history,
    regions,
}: WebsiteCardProps) {
    return (
        <div className="group rounded-lg border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-sm">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{name}</h3>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                    <p className="text-xs text-muted-foreground">{url.replace(/^https?:\/\//, "")}</p>
                </div>
                <StatusBadge status={status} />
            </div>

            <div className="mt-6 flex items-end justify-between">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                <Clock className="h-3 w-3" />
                                Last Checked
                            </div>
                            <p className="text-xs font-medium">{lastChecked}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                <Zap className="h-3 w-3" />
                                Avg. Response
                            </div>
                            <p className="text-xs font-medium">{responseTime}ms</p>
                        </div>
                    </div>

                    <div className="flex gap-1">
                        {regions.map((region, i) => (
                            <div
                                key={i}
                                title={`${region.name}: ${region.status}`}
                                className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    region.status === "UP" ? "bg-up" : "bg-down"
                                )}
                            />
                        ))}
                    </div>
                </div>

                <div className="text-muted-foreground/40 group-hover:text-foreground/60 transition-colors">
                    <Sparkline data={history} width={80} height={30} />
                </div>
            </div>
        </div>
    );
}
