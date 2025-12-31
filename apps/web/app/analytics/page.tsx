"use client";

import { BarChart3, TrendingUp, Clock, Zap, Globe } from "lucide-react";
import { Sparkline } from "@/components/sparkline";

const stats = [
    {
        name: "Overall Uptime",
        value: "99.98%",
        change: "+0.02%",
        icon: TrendingUp,
        data: [98, 99, 99.5, 99.8, 99.9, 99.95, 99.98],
    },
    {
        name: "Avg. Response Time",
        value: "142ms",
        change: "-12ms",
        icon: Zap,
        data: [180, 165, 155, 150, 148, 145, 142],
    },
    {
        name: "Total Incidents",
        value: "3",
        change: "-2",
        icon: Clock,
        data: [5, 4, 4, 3, 3, 3, 3],
    },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
                <p className="text-sm text-muted-foreground">
                    Deep dive into your service performance and reliability.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <div key={stat.name} className="rounded-lg border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div className="rounded-md bg-secondary p-2">
                                <stat.icon className="h-5 w-5 text-foreground" />
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {stat.name}
                                </p>
                                <div className="flex items-center justify-end gap-2">
                                    <span className="text-2xl font-bold">{stat.value}</span>
                                    <span className="text-xs font-medium text-up">{stat.change}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 h-[60px] w-full flex items-end">
                            <Sparkline data={stat.data} width={300} height={60} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Response Time by Region
                    </h3>
                    <div className="space-y-4">
                        {[
                            { region: "US-East (N. Virginia)", time: "42ms" },
                            { region: "EU-Central (Frankfurt)", time: "128ms" },
                            { region: "Asia-East (Tokyo)", time: "256ms" },
                            { region: "US-West (Oregon)", time: "85ms" },
                        ].map((r) => (
                            <div key={r.region} className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{r.region}</span>
                                <div className="flex items-center gap-4 flex-1 max-w-[200px] ml-4">
                                    <div className="h-2 flex-1 rounded-full bg-secondary overflow-hidden">
                                        <div
                                            className="h-full bg-foreground"
                                            style={{ width: `${(parseInt(r.time) / 300) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium w-12 text-right">{r.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Uptime History (Last 30 Days)
                    </h3>
                    <div className="flex items-end gap-1 h-[140px]">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-up/20 hover:bg-up transition-colors rounded-t-sm"
                                style={{ height: `${Math.random() * 20 + 80}%` }}
                                title={`Day ${i + 1}: 100%`}
                            />
                        ))}
                    </div>
                    <div className="mt-4 flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
                        <span>30 days ago</span>
                        <span>Today</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
