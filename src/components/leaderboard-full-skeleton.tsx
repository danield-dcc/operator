export function LeaderboardFullSkeleton() {
  return (
    <>
      <div className="h-4 w-48 animate-pulse rounded bg-elevated" />

      <div className="overflow-hidden rounded border border-border">
        <div className="flex h-10 items-center border-b border-border bg-surface px-5" />

        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
          <div key={i} className="flex items-start gap-6 border-b border-border px-5 py-3">
            <div className="h-3 w-8 animate-pulse rounded bg-elevated" />
            <div className="h-3 w-10 animate-pulse rounded bg-elevated" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-3/4 animate-pulse rounded bg-elevated" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-elevated" />
            </div>
            <div className="h-3 w-16 animate-pulse rounded bg-elevated" />
          </div>
        ))}
      </div>
    </>
  );
}
