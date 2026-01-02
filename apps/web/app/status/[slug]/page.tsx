"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPublicStatusPage } from "@/lib/api/status-pages";
import { StatusBadge } from "@/components/status-badge";
import { Globe, Clock } from "lucide-react";

export default function PublicStatusPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [statusPage, setStatusPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatusPage() {
      try {
        const data = await getPublicStatusPage(slug);
        setStatusPage(data);
      } catch (err: any) {
        setError(err.message || "Status page not found");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchStatusPage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="mt-3 text-muted-foreground text-sm">
            Loading status page...
          </p>
        </div>
      </div>
    );
  }

  if (error || !statusPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold mb-3">404</h1>
          <p className="text-sm text-muted-foreground mb-2">
            Status Page Not Found
          </p>
          <p className="text-xs text-muted-foreground">
            {error ||
              "The status page you're looking for doesn't exist or is not published."}
          </p>
        </div>
      </div>
    );
  }

  const allUp = statusPage.websites?.every((w: any) => w.status === "Up");

  return (
    <div className="min-h-screen bg-background mt-4">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-5 w-5 text-primary flex-shrink-0" />
            <h1 className="text-xl font-semibold truncate">
              {statusPage.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {allUp ? (
              <>
                <div className="h-2.5 w-2.5 rounded-full bg-up animate-pulse" />
                <p className="text-sm font-medium text-up">
                  All Systems Operational
                </p>
              </>
            ) : (
              <>
                <div className="h-2.5 w-2.5 rounded-full bg-down animate-pulse" />
                <p className="text-sm font-medium text-down">
                  Some Systems Down
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">Services</h2>

        <div className="space-y-3">
          {statusPage.websites?.map((website: any) => (
            <div
              key={website.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">
                  {website.name || website.url}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {website.url}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {website.lastCheckedAt && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span>{new Date(website.lastCheckedAt).toLocaleTimeString()}</span>
                  </div>
                )}

                <StatusBadge status={website.status} />
              </div>
            </div>
          ))}
        </div>

        {(!statusPage.websites || statusPage.websites.length === 0) && (
          <div className="text-center py-12">
            <p className="text-xs text-muted-foreground">
              No services are being monitored yet.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t mt-8">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <p className="text-center text-xs text-muted-foreground">
            Powered by BetterStack Clone
          </p>
        </div>
      </div>
    </div>
  );
}
