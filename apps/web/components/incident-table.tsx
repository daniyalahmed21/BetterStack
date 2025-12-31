import { StatusBadge } from "./status-badge";

interface Incident {
    id: string;
    website: string;
    status: "UP" | "DOWN";
    startTime: string;
    endTime: string;
    duration: string;
}

interface IncidentTableProps {
    incidents: Incident[];
}

export function IncidentTable({ incidents }: IncidentTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border bg-card">
            <table className="w-full text-left text-sm">
                <thead className="border-b bg-secondary/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                        <th className="px-6 py-3">Website</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Start Time</th>
                        <th className="px-6 py-3">End Time</th>
                        <th className="px-6 py-3 text-right">Duration</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {incidents.map((incident) => (
                        <tr key={incident.id} className="transition-colors hover:bg-secondary/30">
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                                {incident.website}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <StatusBadge status={incident.status} />
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                                {incident.startTime}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                                {incident.endTime}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right font-mono text-xs">
                                {incident.duration}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
