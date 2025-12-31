import { StatusBadge } from "./status-badge";

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
        <div className="rounded-lg border bg-card overflow-hidden">
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
                                        {incident.website.name || incident.website.url}
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
    );
}
