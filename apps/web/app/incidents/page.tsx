import { IncidentTable } from "@/components/incident-table";
import { mockIncidents } from "@/lib/data";

export default function IncidentsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
                <p className="text-sm text-muted-foreground">
                    Historical record of service disruptions and maintenance.
                </p>
            </div>

            <IncidentTable incidents={mockIncidents} />
        </div>
    );
}
