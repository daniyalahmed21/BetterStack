import { StatusBadge } from "./status-badge";
import { Clock, Calendar, ExternalLink } from "lucide-react";

interface Incident {
    id: string;
    websiteId: string;
    status: "Open" | "Closed";
    startedAt: string;
    endedAt: string | null;
    website: {
        name: string | null;
        url: string;
    };
}

interface IncidentTableProps {
    incidents: Incident[];
}

export function IncidentTable({ incidents }: IncidentTableProps) {
    return (
        <div className="space-y-4">
            {/* Desktop View */}
            <div className="hidden md:block rounded-lg border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 transition-colors">
                                <th className="h-10 px-4 font-medium text-muted-foreground">Website</th>
                                <th className="h-10 px-4 font-medium text-muted-foreground">Status</th>
                                <th className="h-10 px-4 font-medium text-muted-foreground">Start Time</th>
                                <th className="h-10 px-4 font-medium text-muted-foreground">End Time</th>
                                <th className="h-10 px-4 font-medium text-muted-foreground">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {incidents.map((incident) => {
                                const duration = incident.endedAt
                                    ? `${Math.floor(
                                        (new Date(incident.endedAt).getTime() -
                                            new Date(incident.startedAt).getTime()) /
                                        60000
                                    )}m`
                                    : "Ongoing";

                                return (
                                    <tr key={incident.id} className="transition-colors hover:bg-muted/50">
                                        <td className="p-4 font-medium">
                                            <div className="flex items-center gap-2">
                                                {incident.website.name || incident.website.url}
                                                <a href={incident.website.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={incident.status === "Open" ? "DOWN" : "UP"} />
                                        </td>
                                        <td className="p-4 text-muted-foreground">
                                            {new Date(incident.startedAt).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-muted-foreground">
                                            {incident.endedAt ? new Date(incident.endedAt).toLocaleString() : "Ongoing"}
                                        </td>
                                        <td className="p-4 font-mono text-xs">{duration}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile View */}
            <div className="grid gap-4 md:hidden">
                {incidents.map((incident) => {
                    const duration = incident.endedAt
                        ? `${Math.floor(
                            (new Date(incident.endedAt).getTime() -
                                new Date(incident.startedAt).getTime()) /
                            60000
                        )}m`
                        : "Ongoing";

                    return (
                        <div key={incident.id} className="rounded-lg border bg-card p-4 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-sm">
                                        {incident.website.name || incident.website.url}
                                    </h3>
                                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                        {incident.website.url}
                                    </p>
                                </div>
                                <StatusBadge status={incident.status === "Open" ? "DOWN" : "UP"} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                        <Calendar className="h-3 w-3" />
                                        Started
                                    </div>
                                    <p className="text-xs">{new Date(incident.startedAt).toLocaleTimeString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                        <Clock className="h-3 w-3" />
                                        Duration
                                    </div>
                                    <p className="text-xs font-mono">{duration}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
