import { Skeleton } from "@/components/skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="mt-2 h-4 w-64" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-lg border bg-card p-5 space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {Array.from({ length: 3 }).map((_, j) => (
                                        <Skeleton key={j} className="h-1.5 w-1.5 rounded-full" />
                                    ))}
                                </div>
                            </div>
                            <Skeleton className="h-[30px] w-[80px]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
