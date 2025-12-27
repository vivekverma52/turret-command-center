import { Skeleton } from "@/components/ui/skeleton";

export const AnalyticsSkeleton = () => {
  return (
    <div className="h-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Stats Bar Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-card border border-border/30 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="border border-border/30 rounded-lg overflow-hidden bg-card/50">
        <div className="p-4 border-b border-border/30">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b border-border/30 last:border-0">
            <div className="grid grid-cols-6 gap-4">
              {[...Array(6)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsSkeleton;
