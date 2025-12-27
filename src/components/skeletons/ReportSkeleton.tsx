import { Skeleton } from "@/components/ui/skeleton";

interface ReportSkeletonProps {
  columns?: number;
  filterCount?: number;
}

export const ReportSkeleton = ({ columns = 5, filterCount = 5 }: ReportSkeletonProps) => {
  return (
    <div className="h-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="p-4 rounded-lg bg-card border border-border/30">
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${filterCount} gap-4`}>
          {[...Array(filterCount)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="border border-border/30 rounded-lg overflow-hidden bg-card/50">
        {/* Header */}
        <div className="p-4 border-b border-border/30 bg-secondary/30">
          <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
        {/* Rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-4 border-b border-border/30 last:border-0">
            <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {[...Array(columns)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportSkeleton;
