import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="h-full bg-background px-4 md:px-6 py-6 md:py-8">
      {/* Status Panel Skeleton */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-card border border-border/30">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Turret Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-card border border-border/30 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-2 gap-3">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="space-y-2 p-3 rounded bg-secondary/30">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
