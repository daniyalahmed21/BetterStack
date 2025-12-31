import React from 'react'
import { WebsiteCard } from "@/components/website-card";
import { mockWebsites } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Monitors</h1>
        <p className="text-sm text-muted-foreground">
          Real-time status of your websites and services.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockWebsites.map((website) => (
          <WebsiteCard
            key={website.id}
            name={website.name}
            url={website.url}
            status={website.status}
            lastChecked={website.lastChecked}
            responseTime={website.responseTime}
            history={website.history}
            regions={website.regions}
          />
        ))}
      </div>
    </div>
  );
}