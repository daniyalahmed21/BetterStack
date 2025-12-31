"use client";

import { useQuery } from "@tanstack/react-query";
import { WebsiteCard } from "@/components/website-card";
import { getWebsites } from "@/lib/api/websites";
import DashboardLoading from "./loading";

export default function DashboardPage() {
  const { data: websites, isLoading, error } = useQuery({
    queryKey: ["websites"],
    queryFn: getWebsites,
    refetchInterval: 30000,
  });

  if (isLoading) return <DashboardLoading />;
  if (error) return <div>Error loading monitors</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Monitors</h1>
        <p className="text-sm text-muted-foreground">
          Real-time status of your websites and services.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {websites?.map((website) => (
          <WebsiteCard
            key={website.id}
            id={website.id}
            name={website.name}
            url={website.url}
            status={website.status}
            lastCheckedAt={website.lastCheckedAt}
            responseTime={website.responseTime}
            regions={website.regions}
          />
        ))}
      </div>
    </div>
  );
}