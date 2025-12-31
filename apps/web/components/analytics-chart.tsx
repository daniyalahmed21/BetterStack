"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

interface AnalyticsChartProps {
    data: any[];
    type: "line" | "area";
    dataKey: string;
    color?: string;
    height?: number;
}

export function AnalyticsChart({ data, type, dataKey, color = "#000", height = 300 }: AnalyticsChartProps) {
    const ChartComponent = type === "area" ? AreaChart : LineChart;
    const DataComponent = type === "area" ? Area : Line;

    if (!data || data.length === 0) {
        return (
            <div style={{ width: "100%", height }} className="flex items-center justify-center bg-secondary/20 rounded-lg border border-dashed">
                <p className="text-xs text-muted-foreground">No data available</p>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
                <ChartComponent data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="name"
                        hide
                    />
                    <YAxis
                        hide
                        domain={["auto", "auto"]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px",
                        }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                        labelStyle={{ display: "none" }}
                    />
                    <DataComponent
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        fill={type === "area" ? color : "transparent"}
                        fillOpacity={0.1}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                </ChartComponent>
            </ResponsiveContainer>
        </div>
    );
}
