"use client";

import { useQuery } from "@tanstack/react-query";
import { IncidentTable } from "@/components/incident-table";
import { getIncidents } from "@/lib/api/incidents";
import { Skeleton } from "@/components/skeleton";

export default function IncidentsPage() {
    const { data: incidents, isLoading, error } = useQuery({
        queryKey: ["incidents"],
        queryFn: getIncidents,
        refetchInterval: 60000,
    });

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="mt-2 h-4 w-64" />
                </div>
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    if (error) return <div>Error loading incidents</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
                <p className="text-sm text-muted-foreground">
                    Historical record of service disruptions and maintenance.
                </p>
            </div>

            <IncidentTable incidents={incidents || []} />
        </div>
    );
}
