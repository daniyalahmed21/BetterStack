"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IncidentTable } from "@/components/incident-table";
import { getIncidents } from "@/lib/api/incidents";
import { Skeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";
import { AlertCircle } from "lucide-react";
import { SearchInput } from "@/components/search-input";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function IncidentsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);

    const { data: incidents, isLoading, error } = useQuery({
        queryKey: ["incidents"],
        queryFn: getIncidents,
        refetchInterval: 60000,
    });

    const filteredIncidents = incidents?.filter((incident) => {
        if (!debouncedSearch) return true;
        const search = debouncedSearch.toLowerCase();
        return (
            incident.websiteId.toLowerCase().includes(search) ||
            incident.id.toLowerCase().includes(search)
        );
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

            <div className="flex items-center gap-4">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search incidents..."
                    className="flex-1 max-w-sm"
                />
            </div>

            {filteredIncidents?.length === 0 ? (
                <div className="col-span-full">
                    {debouncedSearch ? (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">No incidents found matching "{debouncedSearch}"</p>
                        </div>
                    ) : (
                        <EmptyState
                            icon={AlertCircle}
                            title="No incidents recorded"
                            description="All systems are operational. Historical incidents will appear here."
                        />
                    )}
                </div>
            ) : (
                <IncidentTable incidents={filteredIncidents || []} />
            )}
        </div>
    );
}
